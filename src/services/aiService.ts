import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct API key
const API_KEY = "AIzaSyBZ5jRXy__ayTmxn7Rp5alC7CUar8OFs_c";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askISAV = async (message: string): Promise<string> => {

  const prompt = `
أنت مساعد افتراضي تابع لأكاديمية إيساف (ISAV Academy).
مهمتك الأساسية:
1. الرد على جميع الأسئلة المتعلقة بالأكاديمية مثل التسجيل، الخدمات، البرامج، والدورات التدريبية. 
2. تقديم معلومات موثوقة ومبسطة عن مجالات الزراعة، الطب البيطري، والعلوم. 
3. إذا كان السؤال خارج نطاق الأكاديمية أو التخصصات العلمية، اعتذر بلطف وأوضح أنك متخصص فقط في هذه المجالات.

معلومة أساسية: 
أكاديمية إيساف منصة تعليمية متخصصة في الزراعة، الطب البيطري، والعلوم.

سؤال المستخدم: ${message}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.';
  }
};
