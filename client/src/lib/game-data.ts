
export type QuestionType = 'spelling' | 'grammar' | 'creative';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  hint: string;
  type: QuestionType;
}

export interface World {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  isUnlocked: boolean;
  stars: number; // 0-3
  questions: Question[];
  position: { top: string; left: string }; // For map placement
  icon: string;
}

export const WORLDS: World[] = [
  {
    id: 'hamzat',
    name: 'وادي الهمزات',
    description: 'تعلم قواعد كتابة الهمزة في بداية ووسط ونهاية الكلمة',
    difficulty: 'Easy',
    isUnlocked: true,
    stars: 0,
    position: { top: '75%', left: '20%' },
    icon: 'valley',
    questions: [
      {
        id: 'h1',
        text: 'اختر الهمزة الصحيحة: (  _مـ ــــ ـــــ ـــــ ) البحر',
        options: ['أ', 'إ', 'ؤ', 'ئ'],
        correctIndex: 0,
        hint: 'الهمزة في أول الكلمة تأخذ شكل الألف إذا كانت مفتوحة',
        type: 'spelling'
      },
      {
        id: 'h2',
        text: 'اختر الهمزة الصحيحة: (مسـ _ ــــ ـــة) جميلة',
        options: ['أ', 'إ', 'ئ'],
        correctIndex: 2,
        hint: 'الهمزة على نبرة تكتب على ياء عندما تأتي بعد ساكن',
        type: 'spelling'
      },
      {
        id: 'h3',
        text: 'اختر الهمزة الصحيحة: (مسـ _ ــؤولة)',
        options: ['أ', 'ؤ', 'ئ'],
        correctIndex: 1,
        hint: 'الهمزة على واو تكتب على واو عندما تأتي مضمومة',
        type: 'spelling'
      },
      {
        id: 'h4',
        text: 'كلمة (سماء) تنتهي بـ:',
        options: ['ء', 'أ', 'ؤ', 'ئ'],
        correctIndex: 0,
        hint: 'الهمزة المتطرفة بعد ألف مد تكتب على السطر',
        type: 'spelling'
      },
      {
        id: 'h5',
        text: 'أي الكلمات التالية صحيحة إملائياً؟',
        options: ['إستقلال', 'استقلال', 'أستقلال'],
        correctIndex: 1,
        hint: 'همزة الوصل لا تكتب فوقها أو تحتها همزة في المصادر السداسية',
        type: 'spelling'
      },
      {
        id: 'h6',
        text: 'حدد الكلمة التي تبدأ بهمزة قطع:',
        options: ['ابن', 'اسم', 'أكرم'],
        correctIndex: 2,
        hint: 'الفعل الماضي الرباعي يبدأ بهمزة قطع',
        type: 'spelling'
      },
      {
        id: 'h7',
        text: 'اختر الرسم الصحيح: (يـ _ ــخذ)',
        options: ['أ', 'ؤ', 'ئ'],
        correctIndex: 0,
        hint: 'الهمزة ساكنة وقبلها مفتوح، فتكتب على ألف',
        type: 'spelling'
      },
      {
        id: 'h8',
        text: 'اختر الرسم الصحيح: (مؤ _ ــمن)',
        options: ['أ', 'ؤ', 'ئ'],
        correctIndex: 1,
        hint: 'الهمزة ساكنة وقبلها مضموم، فتكتب على واو',
        type: 'spelling'
      },
      {
        id: 'h9',
        text: 'اختر الرسم الصحيح: (شاطـ _)',
        options: ['ئ', 'ء', 'أ'],
        correctIndex: 0,
        hint: 'الهمزة المتطرفة بعد كسر تكتب على ياء',
        type: 'spelling'
      },
      {
        id: 'h10',
        text: 'اختر الرسم الصحيح: (لؤلـ _)',
        options: ['ؤ', 'ء', 'ئ'],
        correctIndex: 0,
        hint: 'الهمزة المتطرفة بعد ضم تكتب على واو',
        type: 'spelling'
      }
    ]
  },
  {
    id: 'taa',
    name: 'غابة التاءات',
    description: 'ميز بين التاء المربوطة والتاء المفتوحة والهاء',
    difficulty: 'Medium',
    isUnlocked: false,
    stars: 0,
    position: { top: '60%', left: '50%' },
    icon: 'forest',
    questions: [
      {
        id: 't1',
        text: 'هذه (فتا_ ــــ ـــة) مجتهدة',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 0,
        hint: 'التاء المربوطة تنطق هاء عند الوقف وتاء عند الوصل',
        type: 'spelling'
      },
      {
        id: 't2',
        text: 'كتبت (البنـ _ ــــ ـــات) الدرس',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 1,
        hint: 'جمع المؤنث السالم ينتهي بتاء مفتوحة',
        type: 'spelling'
      },
      {
        id: 't3',
        text: '(ميا_ ــــ ـــه) النهر عذبة',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 2,
        hint: 'الهاء تنطق هاءً في الوصل والوقف',
        type: 'spelling'
      },
      {
        id: 't4',
        text: 'ذهبت إلى (المدرسـ _ ــــ ـــة)',
        options: ['ت', 'ة', 'ه'],
        correctIndex: 1,
        hint: 'يمكن نطقها هاء عند الوقف (المدرسةْ)',
        type: 'spelling'
      },
      {
        id: 't5',
        text: 'صوت (السكـ _ ــــ ـــوت) مخيف',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 1,
        hint: 'التاء أصلية في الكلمة',
        type: 'spelling'
      },
      {
        id: 't6',
        text: 'شاهدت (مبارا_ ــــ ـــة) القدم',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 0,
        hint: 'تنطق هاء عند الوقف',
        type: 'spelling'
      },
      {
        id: 't7',
        text: '(وجـ _ ــــ ـــه) الطفل بريء',
        options: ['ة', 'ت', 'ه'],
        correctIndex: 2,
        hint: 'الهاء من أصل الكلمة',
        type: 'spelling'
      },
      {
        id: 't8',
        text: 'قرأت (قصـ _ ــــ ـــة) ممتعة',
        options: ['ت', 'ة', 'ه'],
        correctIndex: 1,
        hint: 'التاء المربوطة',
        type: 'spelling'
      }
    ]
  },
  {
    id: 'alif',
    name: 'جبل الألف اللينة',
    description: 'تعلم متى تكتب الألف قائمة ومتى تكتب مقصورة',
    difficulty: 'Medium',
    isUnlocked: false,
    stars: 0,
    position: { top: '30%', left: '75%' },
    icon: 'mountain',
    questions: [
      {
        id: 'a1',
        text: 'الفعل الماضي من (يدعو) هو:',
        options: ['دعا', 'دعى', 'دعء'],
        correctIndex: 0,
        hint: 'أصل الألف واو (يدعو) فتكتب قائمة',
        type: 'spelling'
      },
      {
        id: 'a2',
        text: 'الفعل الماضي من (يمشي) هو:',
        options: ['مشا', 'مشى', 'مشء'],
        correctIndex: 1,
        hint: 'أصل الألف ياء (يمشي) فتكتب مقصورة',
        type: 'spelling'
      },
      {
        id: 'a3',
        text: 'كلمة (مستشفـ _ ــــ ـــى) كبيرة',
        options: ['ا', 'ى', 'ء'],
        correctIndex: 1,
        hint: 'اسم زائد عن ثلاثة أحرف وليس قبل آخره ياء',
        type: 'spelling'
      },
      {
        id: 'a4',
        text: 'كلمة (دنيـ _ ــــ ـــا) واسعة',
        options: ['ا', 'ى', 'ء'],
        correctIndex: 0,
        hint: 'اسم زائد عن ثلاثة أحرف وقبل آخره ياء',
        type: 'spelling'
      },
      {
        id: 'a5',
        text: '(عصـ _ ــــ ـــا) الراعي طويلة',
        options: ['ا', 'ى', 'ء'],
        correctIndex: 0,
        hint: 'اسم ثلاثي أصل ألفه واو (عصوان)',
        type: 'spelling'
      },
      {
        id: 'a6',
        text: '(فتـ _ ــــ ـــى) شجاع',
        options: ['ا', 'ى', 'ء'],
        correctIndex: 1,
        hint: 'اسم ثلاثي أصل ألفه ياء (فتيان)',
        type: 'spelling'
      }
    ]
  },
  {
    id: 'punctuation',
    name: 'بحيرة الترقيم',
    description: 'أتقن استخدام الفاصلة والنقطة وعلامات الاستفهام',
    difficulty: 'Hard',
    isUnlocked: false,
    stars: 0,
    position: { top: '65%', left: '80%' },
    icon: 'lake',
    questions: [
      {
        id: 'p1',
        text: 'ما أجمل السماء ( _ )',
        options: ['؟', '.', '!'],
        correctIndex: 2,
        hint: 'علامة التعجب تأتي بعد جملة التعجب',
        type: 'grammar'
      },
      {
        id: 'p2',
        text: 'متى ستسافر ( _ )',
        options: ['؟', '.', '!'],
        correctIndex: 0,
        hint: 'علامة الاستفهام تأتي بعد السؤال',
        type: 'grammar'
      },
      {
        id: 'p3',
        text: 'قال المعلم ( _ ) انتبهوا للدرس',
        options: [',', ':', ';'],
        correctIndex: 1,
        hint: 'النقطتان الرأسيتان تأتيان بعد القول',
        type: 'grammar'
      },
      {
        id: 'p4',
        text: 'أحب القراءة ( _ ) والكتابة',
        options: [':', '.', '،'],
        correctIndex: 2,
        hint: 'الفاصلة تفصل بين الجمل المعطوفة',
        type: 'grammar'
      },
      {
        id: 'p5',
        text: 'انتهى الدرس ( _ )',
        options: ['،', '.', '؟'],
        correctIndex: 1,
        hint: 'النقطة توضع في نهاية الجملة التامة',
        type: 'grammar'
      }
    ]
  },
  {
    id: 'creative',
    name: 'قصر الإبداع',
    description: 'اختبر خيالك وقدرتك على التعبير الإبداعي',
    difficulty: 'Expert',
    isUnlocked: false,
    stars: 0,
    position: { top: '15%', left: '50%' },
    icon: 'palace',
    questions: [
      {
        id: 'c1',
        text: 'أكمل الجملة بخيالك: "طار العصفور كأنه ..."',
        options: ['طائرة سريعة', 'سهم ناري', 'ورقة في مهب الريح', 'نجمة في السماء'],
        correctIndex: 3, 
        hint: 'اختر التشبيه الأكثر جمالاً',
        type: 'creative'
      },
      {
        id: 'c2',
        text: 'لو كانت الشمس تتكلم، ماذا ستقول للأرض في الصباح؟',
        options: ['صباح الخير', 'استيقظي يا كسولة', 'سأحرقك اليوم', 'ها قد جئت لأعطيكِ الدفء والنور'],
        correctIndex: 3,
        hint: 'اختر الإجابة الأكثر تعبيراً',
        type: 'creative'
      },
      {
        id: 'c3',
        text: 'ما هو "الذهب الأسود"؟',
        options: ['الفحم', 'الليل', 'البترول', 'الحديد'],
        correctIndex: 2,
        hint: 'لقب يطلق على النفط',
        type: 'creative'
      },
      {
        id: 'c4',
        text: 'أكمل: الكتاب هو ...',
        options: ['مجموعة أوراق', 'صديق لا يمل', 'شيء ثقيل', 'واجب منزلي'],
        correctIndex: 1,
        hint: 'اختر الوصف المجازي',
        type: 'creative'
      },
      {
        id: 'c5',
        text: 'أي من التالي يعتبر تعبيراً مجازياً؟',
        options: ['أكلت التفاحة', 'طرت من الفرح', 'ركضت بسرعة', 'نمت مبكراً'],
        correctIndex: 1,
        hint: 'تعبير يدل على شدة السعادة وليس الطيران الحقيقي',
        type: 'creative'
      },
      {
        id: 'c6',
        text: 'لو كان للقلم لسان، ماذا سيشتكي منه؟',
        options: ['كثرة الكتابة', 'الضغط الشديد', 'سوء الخط', 'نفاد الحبر'],
        correctIndex: 2,
        hint: 'فكر في جماليات الكتابة',
        type: 'creative'
      },
      {
        id: 'c7',
        text: 'صف صوت المطر بكلمة واحدة مبدعة:',
        options: ['مزعج', 'عالٍ', 'موسيقى', 'ماء'],
        correctIndex: 2,
        hint: 'المطر يعزف ألحاناً على الأرض',
        type: 'creative'
      },
      {
        id: 'c8',
        text: 'أكمل: الصديق الحقيقي مثل ...',
        options: ['الظل', 'المرآة', 'الكتاب', 'جميع ما سبق'],
        correctIndex: 3,
        hint: 'الصديق يرافقك، يصدقك القول، ويفيدك',
        type: 'creative'
      }
    ]
  }
];
