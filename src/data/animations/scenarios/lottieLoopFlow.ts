import type { LottieScenario } from '@/types';

export const lottieLoopFlow: LottieScenario = {
  id: 'loop-flow',
  title: '循环执行流程',
  totalSteps: 1,
  continuous: true,
  // 放入 lottie JSON 文件后取消注释：
  // source: require('./assets/lottie/loop-flow.json'),
  source: '' as any,
};
