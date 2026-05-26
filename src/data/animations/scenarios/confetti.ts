import type { LottieScenario } from '@/types';

// 庆祝动画场景 — 需要下载 Lottie JSON 到 ./assets/lottie/confetti.json
// 可从 https://lottiefiles.com 搜索 "confetti" 下载免费 JSON

export const confetti: LottieScenario = {
  id: 'confetti',
  title: '',
  totalSteps: 1,
  continuous: true,
  loop: false,
  // source: require('./assets/lottie/confetti.json'),
  source: '' as any,
};
