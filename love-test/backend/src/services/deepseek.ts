import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY 环境变量未设置');
    }
    _client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }
  return _client;
}

const SYSTEM_PROMPT = `你是一个风趣幽默的恋爱分析师，说话像朋友聊天，不端着，不讲课。

用户刚做完10道恋爱心理测试，请根据答案生成一份轻量有趣的"爱情原型"解读。

要求：
1. 语气轻松有趣，像闺蜜/兄弟聊天，不要太严肃
2. 每段2-3句话就够了，不要长篇大论，不要鸡汤
3. 原型名字要好玩，让人想截图分享
4. 所有输出必须是合法JSON

输出JSON结构：
{
  "archetype": "有趣的原型名，如「傲娇小猫咪」「浪漫赌徒」「佛系恋爱选手」",
  "emoji": "一个emoji",
  "summary": "一句话点评，20字以内，像朋友吐槽",
  "analysis": "简短分析，60-80字就够了，2-3句话",
  "strengths": "你的恋爱优势，40-60字",
  "growth": "小心别...，40-60字",
  "love_advice": "一句话建议，30-40字",
  "share_quote": "适合发朋友圈的金句，15字以内"
}

风格参考：
"你谈恋爱就像开盲盒，每次都觉得下一个会是隐藏款。但说实话，你这个盲盒本来就不错——只是你自己还没发现。"
"别装了，你就是那种表面淡定内心已经演完一部80集电视剧的人。对方回你一个'嗯'，你已经脑补到他出轨了。"`;

function formatAnswers(answers: Record<number, string>): string {
  const qMap: Record<number, string> = {
    1: '喜欢一个人时怎么做', 2: '最不能接受什么', 3: '理想约会场景',
    4: '吵架后的反应', 5: '爱情中最重要的是', 6: '形容爱情里的自己',
    7: '半夜收到暧昧消息', 8: '"对的人"的感觉', 9: '前任联系你',
    10: '爱情的结局',
  };

  return Object.entries(answers)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([id, answer]) => `Q${id}「${qMap[parseInt(id)] || '?'}」→ ${answer}`)
    .join('\n');
}

export async function generateReport(answers: Record<number, string>) {
  const response = await getClient().chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: formatAnswers(answers) },
    ],
    temperature: 0.95,
    max_tokens: 800,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('DeepSeek 返回为空');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('无法解析 AI 返回的 JSON');

  const r = JSON.parse(jsonMatch[0]);

  return {
    archetype: r.archetype || '神秘恋人',
    emoji: r.emoji || '💫',
    summary: r.summary || '',
    analysis: r.analysis || '',
    strengths: r.strengths || '',
    growth: r.growth || '',
    love_advice: r.love_advice || '',
    share_quote: r.share_quote || '',
  };
}
