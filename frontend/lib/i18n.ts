export type Language = 'fr' | 'en' | 'ar'

export interface Translations {
  common: {
    welcome: string
    next: string
    back: string
    submit: string
    cancel: string
    loading: string
    error: string
    success: string
  }
  verification: {
    title: string
    welcomeMessage: string
    step1Title: string
    step1Description: string
    step2Title: string
    step2Description: string
    step3Title: string
    step3Description: string
    step4Title: string
    step4Description: string
    documentFront: string
    documentBack: string
    documentBackOptional: string
    clickToUpload: string
    dragAndDrop: string
    changePhoto: string
    videoVerification: string
    videoCapturedSuccess: string
    startVideoVerification: string
    takePhoto: string
    signature: string
    yourSignature: string
    signatureRecorded: string
    verificationComplete: string
    verifyBeforeSubmit: string
    documents: string
    video: string
    submitVerification: string
    sendingInProgress: string
    poweredBy: string
    secureVerification: string
    securityAndPrivacy: string
    dataEncryption: string
  }
  instructions: {
    title: string
    step1: string
    step2: string
    step3: string
    step4: string
  }
  videoCapture: {
    tips: string
    wellLit: string
    centerFace: string
    followInstructions: string
    keepVisible: string
    noGlasses: string
    placeCenter: string
    turnLeft: string
    turnRight: string
    verificationSuccess: string
  }
  signature: {
    contractTitle: string
    agreementText: string
    acceptTerms: string
    signHere: string
    acceptFirst: string
    legalValue: string
    validate: string
    clear: string
  }
  documentTypes: {
    PASSPORT: string
    ID_CARD: string
    DRIVING_LICENSE: string
  }
}

export const translations: Record<Language, Translations> = {
  fr: {
    common: {
      welcome: 'Bienvenue',
      next: 'Suivant',
      back: 'Retour',
      submit: 'Soumettre',
      cancel: 'Annuler',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    verification: {
      title: 'Vérification d\'identité',
      welcomeMessage: 'Bienvenue',
      step1Title: 'Documents',
      step1Description: 'Prenez des photos claires de votre document. Assurez-vous que toutes les informations sont lisibles.',
      step2Title: 'Vidéo',
      step2Description: 'Nous allons capturer une courte vidéo de votre visage pour vérifier votre identité. Suivez les instructions à l\'écran.',
      step3Title: 'Signature',
      step3Description: 'Lisez attentivement le contrat et signez électroniquement pour finaliser votre vérification.',
      step4Title: 'Confirmation',
      step4Description: 'Veuillez vérifier que toutes les informations sont correctes avant de soumettre.',
      documentFront: 'Document - Recto',
      documentBack: 'Document - Verso',
      documentBackOptional: '(optionnel)',
      clickToUpload: 'Cliquez pour télécharger',
      dragAndDrop: 'ou glissez-déposez',
      changePhoto: 'Changer la photo',
      videoVerification: 'Vidéo de vérification',
      videoCapturedSuccess: 'Vidéo capturée avec succès !',
      startVideoVerification: 'Démarrer la vérification vidéo',
      takePhoto: 'Prendre la photo',
      signature: 'Signature',
      yourSignature: 'Votre signature :',
      signatureRecorded: 'Signature enregistrée avec succès !',
      verificationComplete: 'Vérification complète !',
      verifyBeforeSubmit: 'Veuillez vérifier que toutes les informations sont correctes avant de soumettre.',
      documents: 'Documents',
      video: 'Vidéo',
      submitVerification: 'Soumettre ma vérification',
      sendingInProgress: 'Envoi en cours...',
      poweredBy: 'Propulsé par',
      secureVerification: 'Vérification d\'identité sécurisée par IA',
      securityAndPrivacy: 'Sécurité et confidentialité',
      dataEncryption: 'Vos données sont chiffrées avec SSL 256-bit et ne seront utilisées que pour la vérification de votre identité. Elles seront traitées conformément au RGPD.',
    },
    instructions: {
      title: 'Étape 1: Documents d\'identité',
      step1: 'Prenez une photo claire du recto de votre document',
      step2: 'Prenez une photo du verso (si applicable)',
      step3: 'Prenez un selfie en tenant votre document à côté de votre visage',
      step4: 'Assurez-vous que les photos sont nettes et bien éclairées',
    },
    videoCapture: {
      tips: 'Conseils pour une bonne vérification',
      wellLit: 'Assurez-vous d\'être dans un endroit bien éclairé',
      centerFace: 'Placez votre visage au centre du cadre ovale',
      followInstructions: 'Suivez les instructions pour tourner la tête',
      keepVisible: 'Gardez votre visage visible pendant tout le processus',
      noGlasses: 'Ne portez pas de lunettes de soleil ou masque',
      placeCenter: 'Placez votre visage au centre',
      turnLeft: 'Tournez la tête vers la gauche',
      turnRight: 'Tournez la tête vers la droite',
      verificationSuccess: 'Vérification réussie !',
    },
    signature: {
      contractTitle: 'Contrat de Vérification d\'Identité',
      agreementText: 'J\'ai lu et j\'accepte les termes du contrat ci-dessus. Je confirme que ma signature électronique engage ma responsabilité.',
      acceptTerms: 'Acceptez d\'abord les termes du contrat',
      signHere: 'Signez ici avec votre doigt ou votre souris',
      acceptFirst: 'Acceptez d\'abord les termes du contrat',
      legalValue: 'Valeur légale : Conformément au règlement eIDAS (UE) N°910/2014 et à la loi n°53-05 au Maroc, cette signature électronique a la même valeur juridique qu\'une signature manuscrite. Elle est horodatée et sécurisée par chiffrement SSL 256-bit.',
      validate: 'Valider la signature',
      clear: 'Effacer',
    },
    documentTypes: {
      PASSPORT: 'Passeport',
      ID_CARD: 'Carte d\'identité',
      DRIVING_LICENSE: 'Permis de conduire',
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    verification: {
      title: 'Identity Verification',
      welcomeMessage: 'Welcome',
      step1Title: 'Documents',
      step1Description: 'Take clear photos of your document. Make sure all information is readable.',
      step2Title: 'Video',
      step2Description: 'We will capture a short video of your face to verify your identity. Follow the on-screen instructions.',
      step3Title: 'Signature',
      step3Description: 'Read the contract carefully and sign electronically to finalize your verification.',
      step4Title: 'Confirmation',
      step4Description: 'Please verify that all information is correct before submitting.',
      documentFront: 'Document - Front',
      documentBack: 'Document - Back',
      documentBackOptional: '(optional)',
      clickToUpload: 'Click to upload',
      dragAndDrop: 'or drag and drop',
      changePhoto: 'Change photo',
      videoVerification: 'Verification video',
      videoCapturedSuccess: 'Video captured successfully!',
      startVideoVerification: 'Start video verification',
      takePhoto: 'Take photo',
      signature: 'Signature',
      yourSignature: 'Your signature:',
      signatureRecorded: 'Signature recorded successfully!',
      verificationComplete: 'Verification complete!',
      verifyBeforeSubmit: 'Please verify that all information is correct before submitting.',
      documents: 'Documents',
      video: 'Video',
      submitVerification: 'Submit my verification',
      sendingInProgress: 'Sending...',
      poweredBy: 'Powered by',
      secureVerification: 'AI-powered secure identity verification',
      securityAndPrivacy: 'Security and privacy',
      dataEncryption: 'Your data is encrypted with 256-bit SSL and will only be used for identity verification. It will be processed in accordance with GDPR.',
    },
    instructions: {
      title: 'Step 1: Identity Documents',
      step1: 'Take a clear photo of the front of your document',
      step2: 'Take a photo of the back (if applicable)',
      step3: 'Take a selfie holding your document next to your face',
      step4: 'Make sure the photos are sharp and well-lit',
    },
    videoCapture: {
      tips: 'Tips for good verification',
      wellLit: 'Make sure you are in a well-lit area',
      centerFace: 'Place your face in the center of the oval frame',
      followInstructions: 'Follow the instructions to turn your head',
      keepVisible: 'Keep your face visible throughout the process',
      noGlasses: 'Do not wear sunglasses or mask',
      placeCenter: 'Place your face in the center',
      turnLeft: 'Turn your head to the left',
      turnRight: 'Turn your head to the right',
      verificationSuccess: 'Verification successful!',
    },
    signature: {
      contractTitle: 'Identity Verification Contract',
      agreementText: 'I have read and accept the terms of the contract above. I confirm that my electronic signature is binding.',
      acceptTerms: 'Accept the terms of the contract first',
      signHere: 'Sign here with your finger or mouse',
      acceptFirst: 'Accept the terms of the contract first',
      legalValue: 'Legal value: In accordance with eIDAS regulation (EU) No. 910/2014 and Law No. 53-05 in Morocco, this electronic signature has the same legal value as a handwritten signature. It is timestamped and secured by 256-bit SSL encryption.',
      validate: 'Validate signature',
      clear: 'Clear',
    },
    documentTypes: {
      PASSPORT: 'Passport',
      ID_CARD: 'ID Card',
      DRIVING_LICENSE: 'Driving License',
    },
  },
  ar: {
    common: {
      welcome: 'مرحبا',
      next: 'التالي',
      back: 'رجوع',
      submit: 'إرسال',
      cancel: 'إلغاء',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
    },
    verification: {
      title: 'التحقق من الهوية',
      welcomeMessage: 'مرحبا',
      step1Title: 'الوثائق',
      step1Description: 'التقط صورًا واضحة لوثيقتك. تأكد من أن جميع المعلومات قابلة للقراءة.',
      step2Title: 'الفيديو',
      step2Description: 'سنلتقط مقطع فيديو قصيرًا لوجهك للتحقق من هويتك. اتبع التعليمات على الشاشة.',
      step3Title: 'التوقيع',
      step3Description: 'اقرأ العقد بعناية ووقع إلكترونيًا لإنهاء التحقق.',
      step4Title: 'التأكيد',
      step4Description: 'يرجى التحقق من صحة جميع المعلومات قبل الإرسال.',
      documentFront: 'الوثيقة - الوجه الأمامي',
      documentBack: 'الوثيقة - الخلف',
      documentBackOptional: '(اختياري)',
      clickToUpload: 'انقر للتحميل',
      dragAndDrop: 'أو اسحب وأفلت',
      changePhoto: 'تغيير الصورة',
      videoVerification: 'فيديو التحقق',
      videoCapturedSuccess: 'تم التقاط الفيديو بنجاح!',
      startVideoVerification: 'بدء التحقق بالفيديو',
      takePhoto: 'التقاط صورة',
      signature: 'التوقيع',
      yourSignature: 'توقيعك:',
      signatureRecorded: 'تم تسجيل التوقيع بنجاح!',
      verificationComplete: 'اكتمل التحقق!',
      verifyBeforeSubmit: 'يرجى التحقق من صحة جميع المعلومات قبل الإرسال.',
      documents: 'الوثائق',
      video: 'الفيديو',
      submitVerification: 'إرسال التحقق',
      sendingInProgress: 'جاري الإرسال...',
      poweredBy: 'مدعوم من',
      secureVerification: 'التحقق الآمن من الهوية بالذكاء الاصطناعي',
      securityAndPrivacy: 'الأمن والخصوصية',
      dataEncryption: 'بياناتك مشفرة بتشفير SSL 256 بت ولن تستخدم إلا للتحقق من الهوية. سيتم معالجتها وفقًا للائحة العامة لحماية البيانات.',
    },
    instructions: {
      title: 'الخطوة 1: وثائق الهوية',
      step1: 'التقط صورة واضحة للجزء الأمامي من وثيقتك',
      step2: 'التقط صورة للجزء الخلفي (إن وجد)',
      step3: 'التقط صورة شخصية مع حمل وثيقتك بجانب وجهك',
      step4: 'تأكد من أن الصور واضحة ومضاءة جيدًا',
    },
    videoCapture: {
      tips: 'نصائح للتحقق الجيد',
      wellLit: 'تأكد من أنك في مكان مضاء جيدًا',
      centerFace: 'ضع وجهك في وسط الإطار البيضاوي',
      followInstructions: 'اتبع التعليمات لتدوير رأسك',
      keepVisible: 'حافظ على وجهك مرئيًا طوال العملية',
      noGlasses: 'لا ترتدي نظارات شمسية أو قناع',
      placeCenter: 'ضع وجهك في المنتصف',
      turnLeft: 'أدر رأسك إلى اليسار',
      turnRight: 'أدر رأسك إلى اليمين',
      verificationSuccess: 'نجح التحقق!',
    },
    signature: {
      contractTitle: 'عقد التحقق من الهوية',
      agreementText: 'لقد قرأت وأوافق على شروط العقد أعلاه. أؤكد أن توقيعي الإلكتروني ملزم.',
      acceptTerms: 'اقبل شروط العقد أولاً',
      signHere: 'وقع هنا بإصبعك أو بالماوس',
      acceptFirst: 'اقبل شروط العقد أولاً',
      legalValue: 'القيمة القانونية: وفقًا للائحة eIDAS (الاتحاد الأوروبي) رقم 910/2014 والقانون رقم 53-05 في المغرب، لهذا التوقيع الإلكتروني نفس القيمة القانونية للتوقيع اليدوي. إنه مؤرخ ومؤمن بتشفير SSL 256 بت.',
      validate: 'تأكيد التوقيع',
      clear: 'مسح',
    },
    documentTypes: {
      PASSPORT: 'جواز السفر',
      ID_CARD: 'بطاقة الهوية',
      DRIVING_LICENSE: 'رخصة القيادة',
    },
  },
}

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.fr
}
