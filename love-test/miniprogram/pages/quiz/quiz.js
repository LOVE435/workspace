const app = getApp();
const questions = [
  { id: 1, text: '当你喜欢一个人时，你通常会怎么做？', options: [
    { label: 'A', text: '默默关注，等对方先发现你' },
    { label: 'B', text: '主动制造偶遇，用行动表达好感' },
    { label: 'C', text: '直接告诉对方你的心意' },
    { label: 'D', text: '先成为好朋友，再慢慢升温' },
  ]},
  { id: 2, text: '在一段关系中，你最不能接受什么？', options: [
    { label: 'A', text: '对方说话不算数，承诺不兑现' },
    { label: 'B', text: '没有个人空间，被过度控制' },
    { label: 'C', text: '对方不愿意沟通，冷战' },
    { label: 'D', text: '生活太平淡，没有惊喜和仪式感' },
  ]},
  { id: 3, text: '你理想的约会场景是？', options: [
    { label: 'A', text: '安静的咖啡馆，两个人聊到忘记时间' },
    { label: 'B', text: '一起做饭看电影，在家窝一整天' },
    { label: 'C', text: '去没去过的地方冒险，刺激又新鲜' },
    { label: 'D', text: '精心打扮去高级餐厅，仪式感拉满' },
  ]},
  { id: 4, text: '吵架之后，你更倾向于？', options: [
    { label: 'A', text: '先冷静一下，想清楚了再沟通' },
    { label: 'B', text: '主动打破僵局，不想拖太久' },
    { label: 'C', text: '等对方先低头，看对方什么态度' },
    { label: 'D', text: '写小作文表达自己的感受和想法' },
  ]},
  { id: 5, text: '你认为爱情中最重要的是？', options: [
    { label: 'A', text: '信任和忠诚，这是感情的基础' },
    { label: 'B', text: '一起成长，两个人变得越来越好' },
    { label: 'C', text: '心动和激情，保持恋爱的感觉' },
    { label: 'D', text: '被理解和接纳，做真实的自己' },
  ]},
  { id: 6, text: '如果用一个词形容你在爱情里的样子，你会选？', options: [
    { label: 'A', text: '温柔守护者' },
    { label: 'B', text: '浪漫冒险家' },
    { label: 'C', text: '理智规划师' },
    { label: 'D', text: '自由追光者' },
  ]},
  { id: 7, text: '半夜收到暧昧对象的消息，你的第一反应？', options: [
    { label: 'A', text: '秒回，然后聊到天亮' },
    { label: 'B', text: '看了但故意过会儿再回' },
    { label: 'C', text: '心里开心但假装淡定' },
    { label: 'D', text: '直接问对方是不是睡不着想我了' },
  ]},
  { id: 8, text: '你觉得"对的人"是什么感觉？', options: [
    { label: 'A', text: '在一起不说话也很舒服' },
    { label: 'B', text: '每天都像第一天认识那样心动' },
    { label: 'C', text: '能一起规划未来，方向一致' },
    { label: 'D', text: '在他面前可以完全做自己' },
  ]},
  { id: 9, text: '前任突然发消息说想你了，你会？', options: [
    { label: 'A', text: '已读不回，过去的就过去了' },
    { label: 'B', text: '礼貌回复，但不会再见' },
    { label: 'C', text: '会聊一下，看看对方变没变' },
    { label: 'D', text: '内心纠结，不知道该怎么办' },
  ]},
  { id: 10, text: '如果爱情是一部电影，你希望结局是？', options: [
    { label: 'A', text: '两个人牵着手走向远方' },
    { label: 'B', text: '在夕阳下拥吻，画面定格' },
    { label: 'C', text: '没有结局，故事还在继续' },
    { label: 'D', text: '各自成长后重逢，相视一笑' },
  ]},
];

Page({
  data: {
    current: 1, total: 10, question: questions[0],
    selected: '', answers: {}, progress: 10, isLast: false,
  },
  selectOption(e) {
    const { label, text } = e.currentTarget.dataset;
    const answers = this.data.answers;
    answers[this.data.question.id] = text;
    this.setData({ selected: label, answers });
  },
  nextQuestion() {
    if (!this.data.selected) return;
    if (this.data.isLast) {
      app.globalData.quizAnswers = this.data.answers;
      wx.navigateTo({ url: '/pages/loading/loading' });
      return;
    }
    const next = this.data.current + 1;
    const isLast = next === this.data.total;
    this.setData({
      current: next, question: questions[next - 1], selected: '',
      progress: Math.round((next / this.data.total) * 100), isLast,
    });
  },
});
