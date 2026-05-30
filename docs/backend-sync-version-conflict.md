# 进度同步版本冲突检测

## 状态

⏳ 以后补（单设备用户碰不到，多设备场景时实施）

## 当前问题

### 代码现状

`ProgressService.syncProgress()` — `POST /api/v1/progress/sync`：

```java
// 现在的逻辑
progressRepo.findById(userId)
    .map(remote -> {
        // 有远程数据 → 直接返回远程，不管客户端 version 高低
        ProgressSyncResponse resp = toResponse(remote);
        resp.setMerged(true);
        return resp;
    })
    .orElseGet(() -> {
        // 无远程数据 → 保存客户端
        ProgressSyncResponse resp = upsertProgress(userId, req);
        resp.setMerged(false);
        return resp;
    });
```

客户端在 `ProgressSyncRequest` 里传了 `version: int`，**服务端完全不看**。

### 具体丢数据场景

```
T1: 设备 A 离线学习，本地进度 version=5
T2: 设备 B 线上同步，上传 version=5 → 服务器 version=5
T3: 设备 B 继续学，version=5→6，再次同步 → 服务器 version=6
T4: 设备 A 上线，调用 syncProgress(version=5)：
     - 服务器有数据(version=6)
     - 不看版本号，直接返回 B 的数据
     - A 离线期间的进度消失
```

客户端有合并逻辑，但合并不了"离线产生的纯增量变化"——A 的本地修改不在服务端数据里，merge 也找不回来。

## 有什么用

### 修复后的行为

```
客户端 version > 服务器 version → 客户端赢（离线学完回来了）
客户端 version ≤ 服务器 version → 服务器赢（另一台设备已更新）
无服务器数据 → 客户端赢（首次同步）
```

version 就是简易的"谁更新"判定。不需要向量时钟（CRDT），原因：
- 用户只有单个账号，不是多用户协同编辑
- 进度数据类型简单（Map + boolean + int），不是文本文档
- 冲突场景极少（同一用户两台设备同时学同一门课的概率近乎零）

### 修好之后

- 设备 A 离线学完，version=6 > 服务器 version=5 → A 的数据写入服务器
- 设备 B 稍后上线，version=5 < 服务器 version=6 → 拿到 A 的数据，客户端合并后 B 也看到了 A 的进度
- 没丢任何东西

## 怎么做

### 只改 1 个文件：`ProgressService.java`

**改动点**：`syncProgress` 方法，在 `map(remote -> ...)` 分支里加版本比较。

```java
@Transactional
public ProgressSyncResponse syncProgress(UUID userId, ProgressSyncRequest req) {
    return progressRepo.findById(userId)
        .map(remote -> {
            if (req.getVersion() > remote.getVersion()) {
                // 客户端版本更高 → 客户端赢，覆盖保存
                remote.setData(req.getData());
                remote.setVersion(req.getVersion());
                remote.setUpdatedAt(Instant.now());
                progressRepo.save(remote);
                ProgressSyncResponse resp = toResponse(remote);
                resp.setMerged(false);
                return resp;
            } else {
                // 服务端版本相同或更高 → 返回服务端数据，客户端合并
                ProgressSyncResponse resp = toResponse(remote);
                resp.setMerged(true);
                return resp;
            }
        })
        .orElseGet(() -> {
            ProgressSyncResponse resp = upsertProgress(userId, req);
            resp.setMerged(false);
            return resp;
        });
}
```

### 不改的文件

| 文件 | 原因 |
|------|------|
| `ProgressController.java` | 接口不変 |
| `ProgressSyncRequest.java` | `version` 字段已经存在 |
| `ProgressSyncResponse.java` | `merged` 字段已经存在，客户端已经在用 |
| `UserProgress.java` | 实体不变 |
| `UserProgressRepository.java` | 不需要加条件查询 |
| 前端 `syncEngine.ts` | 已经在传 version + 读 merged |

### 不改 `upsertProgress` 的原因

`upsertProgress` 对应 `PUT /api/v1/progress`，语义是"用我的数据强制覆盖"。不需要在 PUT 上加版本锁。需要协商的是 `POST /sync`。

### 测试

在前端用两台设备/两个模拟器同时学习同一门课，检查进度是否一致。

---

## 为什么当前不紧急

| 条件 | 现状 |
|------|------|
| 用户数 | < 10 |
| 多设备用户 | 可能 0 个 |
| 单设备场景 | 永久不会触发 |
| 有无 bug 报告 | 没发生过 |

触发时机：用户反馈"我在两台手机上学习进度不同步" 或 用户量突破 500 开始有多设备需求。
