import React, { useState } from 'react';

const YarisugiDashboard = () => {
  const [activePage, setActivePage] = useState('top');
  const [showApproval, setShowApproval] = useState(false);
  const [customersPerPage, setCustomersPerPage] = useState(50);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddDatabase, setShowAddDatabase] = useState(false);
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // ★ 追加：モバイル用サイドバー開閉

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: '料金'
  });
  const [databaseText, setDatabaseText] = useState('');
  const [databaseFiles, setDatabaseFiles] = useState([]);
  const [aiFiles, setAiFiles] = useState([]);
  const [aiGeneratedFaqs, setAiGeneratedFaqs] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [faqCategories, setFaqCategories] = useState(['全て', '料金', 'サポート', '契約', '機能', 'その他']);

  // FAQBuilder関連の状態
  const [uploadedContent, setUploadedContent] = useState('');
  const [generatedFaqs, setGeneratedFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDuplicateWarning, setShowDuplicateWarning] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    customerName: '',
    location: '',
    industry: '',
    siteUrl: '',
    snsStatus: '',
    lineId: '',
    email: '',
    salesPerson: '山田太郎',
    status: '新規'
  });
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showReportPreview = () => setShowReport(true);
  const showApprovalScreen = () => setShowApproval(true);

  const handleAddFaq = () => {
    const finalCategory = isCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : newFaq.category;
    
    if (isCustomCategory && customCategory.trim() && !faqCategories.includes(customCategory.trim())) {
      setFaqCategories(prev => [...prev, customCategory.trim()]);
    }

    if (newFaq.question.trim() && newFaq.answer.trim()) {
      alert(`FAQ追加完了！\n質問: ${newFaq.question}\n回答: ${newFaq.answer}\nカテゴリ: ${finalCategory}`);
      setNewFaq({ question: '', answer: '', category: '料金' });
      setCustomCategory('');
      setIsCustomCategory(false);
      setShowAddFaq(false);
    }
  };

  const handleAiFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.name.split('.').pop(),
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      processed: false
    }));
    
    setAiFiles(prev => [...prev, ...newFiles]);
    
    setTimeout(() => {
      const generatedFaqs = [];
      files.forEach((file, fileIndex) => {
        const faqTemplates = [
          { category: '料金・価格', question: `基本料金はいくらですか？`, answer: `基本料金は月額50,000円からとなっております。ご利用規模やオプション機能により価格が変動いたします。詳細なお見積りについてはお問い合わせください。` },
          { category: '料金・価格', question: `初期費用は必要ですか？`, answer: `初期導入費用として100,000円を頂戴しております。これには初回設定、データ移行、操作研修が含まれます。` },
          { category: 'サービス内容・機能', question: `どのような機能が利用できますか？`, answer: `顧客管理、売上分析、レポート作成、自動化機能、API連携などが利用できます。` },
          { category: 'サービス内容・機能', question: `カスタマイズは可能ですか？`, answer: `はい、ご要望に応じたカスタマイズが可能です。追加開発費用は別途お見積りとなります。` },
          { category: '導入・設定', question: `導入期間は？`, answer: `標準的な導入期間は2-4週間程度です。` }
        ];
        const numFaqs = Math.floor(Math.random() * 5) + 8;
        const selectedFaqs = faqTemplates
          .sort(() => 0.5 - Math.random())
          .slice(0, numFaqs)
          .map((template, index) => ({
            id: Date.now() + fileIndex * 100 + index,
            category: template.category,
            question: template.question,
            answer: template.answer,
            source: file.name,
            editable: true
          }));
        generatedFaqs.push(...selectedFaqs);
      });
      
      setAiGeneratedFaqs(generatedFaqs);
      const newCategories = [...new Set(generatedFaqs.map(faq => faq.category))];
      newCategories.forEach(category => {
        if (!faqCategories.includes(category)) setFaqCategories(prev => [...prev, category]);
      });
      setAiFiles(prev => prev.map(f => newFiles.find(nf => nf.id === f.id) ? {...f, processed: true} : f));
    }, 3000);
  };

  const updateAiFaq = (id, field, value) => {
    setAiGeneratedFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
  };
  const addAiFaq = (faq) => {
    alert(`FAQ追加完了！\nカテゴリ: ${faq.category}\n質問: ${faq.question}`);
    setAiGeneratedFaqs(prev => prev.filter(f => f.id !== faq.id));
  };
  const removeAiFaq = (id) => setAiGeneratedFaqs(prev => prev.filter(faq => faq.id !== id));

  const handleDatabaseFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.name.split('.').pop(),
      date: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      processed: false
    }));
    setDatabaseFiles(prev => [...prev, ...newFiles]);
    setTimeout(() => {
      setDatabaseFiles(prev => prev.map(f => newFiles.find(nf => nf.id === f.id) ? {...f, processed: true} : f));
      alert(`${files.length}個のファイルからFAQを自動生成しました！`);
    }, 2000);
  };

  const handleDatabaseTextSubmit = () => {
    if (databaseText.trim()) {
      alert(`テキストからFAQを自動生成しました！\n入力文字数: ${databaseText.length}文字`);
      setDatabaseText('');
      setShowAddDatabase(false);
    }
  };

  // FAQBuilder関連
  const generateComprehensiveFAQs = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const comprehensiveFaqs = [
        { id: 1, category: '基本情報', question: 'サービスの概要を教えてください', answer: '当社のサービスは、クラウドベースの統合管理システムです。', status: 'new', similarity: 0 },
        { id: 2, category: '基本情報', question: '対応業種は何ですか？', answer: '製造業、小売業、サービス業など幅広い業種に対応しています。', status: 'new', similarity: 0 },
        { id: 3, category: '基本情報', question: '会社の設立はいつですか？', answer: '2010年に設立し、15年以上の実績があります。', status: 'new', similarity: 0 },
        { id: 4, category: '料金・プラン', question: '料金プランの種類を教えてください', answer: 'スターター、スタンダード、エンタープライズの3種類です。', status: 'new', similarity: 0 },
        { id: 5, category: '料金・プラン', question: '無料トライアルはありますか？', answer: '30日間の無料トライアルをご利用いただけます。', status: 'new', similarity: 0 },
        { id: 6, category: '料金・プラン', question: '支払い方法は何がありますか？', answer: '銀行振込、クレジットカード、口座振替に対応しています。', status: 'new', similarity: 0 },
        { id: 7, category: '料金・プラン', question: '月払いと年払いの違いは？', answer: '年払いは2ヶ月分の割引。', status: 'new', similarity: 0 },
        { id: 8, category: '機能・仕様', question: '主要機能を教えてください', answer: '顧客管理、在庫管理、売上分析、レポート作成など。', status: 'new', similarity: 0 },
        { id: 9, category: '機能・仕様', question: 'モバイル対応していますか？', answer: 'iOS/Androidアプリに対応。', status: 'new', similarity: 0 },
        { id: 10, category: '機能・仕様', question: 'API連携は可能ですか？', answer: 'REST APIを提供しています。', status: 'new', similarity: 0 },
        { id: 11, category: '機能・仕様', question: 'データのエクスポートは？', answer: 'CSV、Excel、PDFに対応。', status: 'new', similarity: 0 },
        { id: 12, category: '導入・設定', question: '導入期間は？', answer: '通常2-4週間。', status: 'new', similarity: 0 },
        { id: 13, category: '導入・設定', question: '既存システムからの移行は？', answer: 'データ移行をサポートします。', status: 'new', similarity: 0 },
        { id: 14, category: '導入・設定', question: '必要な環境は？', answer: 'インターネット接続で利用可能。', status: 'new', similarity: 0 },
        { id: 15, category: 'セキュリティ', question: '対策は？', answer: 'SSL、2FA、定期監査。', status: 'new', similarity: 0 },
        { id: 16, category: 'セキュリティ', question: 'バックアップは？', answer: '毎日自動バックアップ、30日保持。', status: 'new', similarity: 0 },
        { id: 17, category: 'セキュリティ', question: '権限管理は？', answer: '役職・部署単位で設定可能。', status: 'new', similarity: 0 },
        { id: 18, category: 'サポート', question: 'サポート体制は？', answer: '平日9-18時、緊急24h。', status: 'new', similarity: 0 },
        { id: 19, category: 'サポート', question: 'マニュアルは？', answer: 'オンラインと動画あり。', status: 'new', similarity: 0 },
        { id: 20, category: 'サポート', question: '研修は？', answer: '導入時と定期研修あり。', status: 'new', similarity: 0 },
        { id: 21, category: '契約・解約', question: '契約期間は？', answer: '最低1年、その後は月次更新。', status: 'new', similarity: 85 },
        { id: 22, category: '契約・解約', question: '解約時のデータは？', answer: '解約後30日間ダウンロード可能。', status: 'new', similarity: 0 },
        { id: 23, category: '契約・解約', question: 'プラン変更は？', answer: 'いつでも上位プランへ変更可。', status: 'new', similarity: 0 },
      ];
      const uniqueCategories = [...new Set(comprehensiveFaqs.map(f => f.category))];
      setCategories(uniqueCategories);
      setGeneratedFaqs(comprehensiveFaqs);
      setIsGenerating(false);
    }, 800);
  };

  const handleFaqFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) setUploadedContent(`ファイル: ${file.name} がアップロードされました`);
  };
  const handleFaqTextInput = (text) => { if (text.trim()) setUploadedContent(text); };
  const updateGeneratedFaq = (id, field, value) => {
    setGeneratedFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, [field]: value, status: 'edited' } : faq));
  };
  const deleteGeneratedFaq = (id) => setGeneratedFaqs(prev => prev.filter(faq => faq.id !== id));
  const addNewGeneratedFaq = () => {
    const newFaq = { id: Date.now(), category: selectedCategory === 'all' ? '新規カテゴリ' : selectedCategory, question: '', answer: '', status: 'new', similarity: 0 };
    setGeneratedFaqs(prev => [newFaq, ...prev]);
  };
  const saveGeneratedFaq = (faq) => {
    if (faq.similarity > 80) { setShowDuplicateWarning({ ...showDuplicateWarning, [faq.id]: true }); return; }
    alert(`FAQ登録完了:\nカテゴリ: ${faq.category}\n質問: ${faq.question}`);
    setGeneratedFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, status: 'saved' } : f));
  };
  const saveAllGeneratedFaqs = () => {
    const newFaqs = generatedFaqs.filter(faq => faq.status !== 'saved' && faq.similarity < 80);
    alert(`${newFaqs.length}件のFAQを一括登録しました`);
    setGeneratedFaqs(prev => prev.map(faq => ({ ...faq, status: 'saved' })));
  };

  const filteredFaqs = generatedFaqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  React.useEffect(() => {
    if (uploadedContent) generateComprehensiveFAQs();
  }, [uploadedContent]);

  const generateProposal = () => alert('レポートを抽出しています...');

  const Button = ({ onClick, variant = 'primary', size = 'md', className = '', children, type='button', disabled }) => {
    const base = "font-semibold cursor-pointer transition-all border-none rounded-lg disabled:opacity-60 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      danger: "bg-red-500 text-white hover:bg-red-600"
    };
    const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base" };
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
        {children}
      </button>
    );
  };

  const NavItem = ({ label, page, active, onClick }) => (
    <div
      onClick={() => { onClick(page); setMobileSidebarOpen(false); }}
      className={`flex items-center px-5 py-3 cursor-pointer transition-all text-sm ${active ? 'bg-indigo-500 text-white' : 'text-slate-200 hover:bg-slate-700'}`}
    >
      <span>{label}</span>
    </div>
  );

  // ダミー顧客データ（顧客一覧のモバイルカード用）
  const customers = [
    {
      company: '株式会社テックソリューション',
      domain: 'tech-solution.com',
      person: '田中一郎',
      email: 'tanaka@tech-solution.com',
      industry: 'IT・通信',
      status: '商談中',
      owner: '山田太郎',
      updated: '2024-01-15'
    },
    {
      company: '株式会社グローバル商事',
      domain: 'global-trading.co.jp',
      person: '佐藤花子',
      email: 'sato@global-trading.co.jp',
      industry: '小売・流通',
      status: '成約',
      owner: '佐藤花子',
      updated: '2024-01-12'
    },
    {
      company: '株式会社製造工業',
      domain: 'manufacturing.com',
      person: '鈴木次郎',
      email: 'suzuki@manufacturing.com',
      industry: '製造業',
      status: '新規',
      owner: '鈴木一郎',
      updated: '2024-01-10'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* ヘッダー */}
      <div className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-3 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* モバイル：ハンバーガー */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Yarisugi
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative cursor-pointer text-xl hidden sm:block">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <Button size="sm" className="hidden sm:inline-flex">CSVエクスポート</Button>
        </div>
      </div>

      <div className="flex pt-16">
        {/* サイドバー（デスクトップ） */}
        <div className="hidden md:block md:w-64 bg-slate-800 text-slate-200 py-4 md:py-6 min-h-[calc(100vh-64px)]">
          <nav className="space-y-1">
            <NavItem label="トップページ" page="top" active={activePage === 'top'} onClick={setActivePage} />
            <NavItem label="顧客一覧" page="customers" active={activePage === 'customers'} onClick={setActivePage} />
            <NavItem label="FAQ設定" page="faq" active={activePage === 'faq'} onClick={setActivePage} />
            <NavItem label="ナレッジ検索" page="search" active={activePage === 'search'} onClick={setActivePage} />
            <NavItem label="ナレッジDB" page="database" active={activePage === 'database'} onClick={setActivePage} />
            <NavItem label="基本情報入力" page="profile" active={activePage === 'profile'} onClick={setActivePage} />
          </nav>
        </div>

        {/* モバイル用ドロワー */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-800 z-50 p-4 text-slate-200 md:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold">メニュー</div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-10 h-10 grid place-items-center rounded-lg hover:bg-slate-700"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <nav className="space-y-1">
                <NavItem label="トップページ" page="top" active={activePage === 'top'} onClick={setActivePage} />
                <NavItem label="顧客一覧" page="customers" active={activePage === 'customers'} onClick={setActivePage} />
                <NavItem label="FAQ設定" page="faq" active={activePage === 'faq'} onClick={setActivePage} />
                <NavItem label="ナレッジ検索" page="search" active={activePage === 'search'} onClick={setActivePage} />
                <NavItem label="ナレッジDB" page="database" active={activePage === 'database'} onClick={setActivePage} />
                <NavItem label="基本情報入力" page="profile" active={activePage === 'profile'} onClick={setActivePage} />
              </nav>
            </div>
          </>
        )}

        {/* メイン */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activePage === 'top' && (
            <div className="space-y-6">
              {/* 新規顧客登録 */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">新規顧客登録</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormGroup label="会社名">
                    <Input value={formData.companyName} onChange={(v) => handleInputChange('companyName', v)} placeholder="株式会社〇〇" />
                  </FormGroup>
                  <FormGroup label="顧客名（担当者名）">
                    <Input value={formData.customerName} onChange={(v) => handleInputChange('customerName', v)} placeholder="田中一郎" />
                  </FormGroup>
                  <FormGroup label="所在地">
                    <Input value={formData.location} onChange={(v) => handleInputChange('location', v)} placeholder="東京都渋谷区" />
                  </FormGroup>
                  <FormGroup label="業種">
                    <Select value={formData.industry} onChange={(v) => handleInputChange('industry', v)} placeholder="選択してください" options={['製造業', 'IT・通信', '小売・流通', '建設・不動産', 'サービス業', '金融・保険', '医療・福祉', 'その他']} />
                  </FormGroup>
                  <FormGroup label="サイトURL">
                    <Input type="url" value={formData.siteUrl} onChange={(v) => handleInputChange('siteUrl', v)} placeholder="https://example.com" />
                  </FormGroup>
                  <FormGroup label="SNS運用状況">
                    <Select value={formData.snsStatus} onChange={(v) => handleInputChange('snsStatus', v)} placeholder="選択してください" options={['積極的に運用中（毎日投稿）','定期的に運用中（週2-3回）','たまに更新（月数回）','アカウントはあるが更新なし','SNS未運用']} />
                  </FormGroup>
                  <FormGroup label="LINE ID">
                    <Input value={formData.lineId} onChange={(v) => handleInputChange('lineId', v)} placeholder="@example_line" />
                  </FormGroup>
                  <FormGroup label="メールアドレス">
                    <Input type="email" value={formData.email} onChange={(v) => handleInputChange('email', v)} placeholder="example@email.com" />
                  </FormGroup>
                  <FormGroup label="担当営業">
                    <Select value={formData.salesPerson} onChange={(v) => handleInputChange('salesPerson', v)} options={['山田太郎', '佐藤花子', '鈴木一郎']} />
                  </FormGroup>
                  <FormGroup label="ステータス">
                    <Select value={formData.status} onChange={(v) => handleInputChange('status', v)} options={['新規', '商談中', '成約', '失注']} />
                  </FormGroup>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <Button className="w-full sm:w-auto">接続開始</Button>
                  <Button className="w-full sm:w-auto" onClick={showReportPreview}>レポートを抽出</Button>
                  <Button className="w-full sm:w-auto" variant="secondary">キャンセル</Button>
                </div>
              </div>

              {/* メール/LINE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">📧 メール・LINE自動化</h2>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                    <h3 className="text-blue-700 mb-3 flex items-center gap-2"><span>🔔</span><span>最新の受信メール</span></h3>
                    <div className="bg-white rounded-md p-4 mb-3 cursor-pointer hover:bg-gray-50" onClick={showApprovalScreen}>
                      <p className="font-semibold mb-1">株式会社テックソリューション</p>
                      <p className="text-sm text-gray-600">件名: 見積もりについて問い合わせ</p>
                      <p className="text-xs text-gray-400 mt-1">受信: 10分前</p>
                    </div>
                    <Button size="sm">返信テンプレート選択</Button>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-green-700 mb-3 flex items-center gap-2"><span>💬</span><span>最新のLINEメッセージ</span></h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-md p-4 cursor-pointer hover:bg-gray-50">
                        <p className="font-semibold mb-1">佐藤花子（グローバル商事）</p>
                        <p className="text-sm text-gray-600">メッセージ: 来週の打ち合わせの件で...</p>
                        <p className="text-xs text-gray-400 mt-1">受信: 25分前</p>
                      </div>
                      <div className="bg-white rounded-md p-4 cursor-pointer hover:bg-gray-50">
                        <p className="font-semibold mb-1">鈴木次郎（製造工業）</p>
                        <p className="text-sm text-gray-600">メッセージ: 資料ありがとうございました</p>
                        <p className="text-xs text-gray-400 mt-1">受信: 1時間前</p>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3">個別LINE選択</Button>
                  </div>
                </div>

                {/* レポートプレビュー */}
                {showReport && (
                  <div className="bg-gray-100 rounded-xl p-4 sm:p-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-bold mb-4 text-gray-800">顧客分析レポート</h2>
                      <Section title="🎯 ターゲット分析" items={[
                        '主要ターゲット: 中小企業（従業員50-200名）',
                        '地域特性: 首都圏を中心とした都市部展開',
                        '業界動向: デジタル化推進により需要拡大傾向'
                      ]}/>
                      <Section title="💰 収益予測" items={[
                        '月額契約単価: ¥50,000-¥150,000',
                        '年間LTV: ¥800,000',
                        '成約予測: 3ヶ月以内の確率 75%'
                      ]}/>
                      <Section title="📊 競合分析" items={[
                        '競合他社: 大手3社との差別化ポイント明確',
                        '価格優位性: 同等サービスより20%コスト削減可能',
                        '技術優位性: AI活用による自動化レベルが高い'
                      ]}/>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button className="w-full sm:w-auto">詳細レポートをダウンロード</Button>
                        <Button className="w-full sm:w-auto" variant="secondary" onClick={() => setShowReport(false)}>閉じる</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'faq' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">FAQ管理システム</h1>
                <p className="text-gray-600 mt-1">FAQ追加とデータベース作成のモーダル機能</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                  <Button onClick={() => setShowAddFaq(true)} className="w-full sm:w-auto">+ FAQ追加</Button>
                  <Button onClick={() => setShowAddDatabase(true)} className="w-full sm:w-auto" variant="primary">📚 データベース作成</Button>
                  <Button onClick={() => setShowAiAssist(true)} className="w-full sm:w-auto" variant="primary">✨ AIアシスト FAQ作成</Button>
                </div>
                {/* 既存FAQサンプル */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">既存のFAQ</h2>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">料金</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">手動追加</span>
                    </div>
                    <h3 className="font-semibold mb-1">Q: 基本プランの料金はいくらですか？</h3>
                    <p className="text-gray-700 mb-1">A: 基本プランは月額50,000円で10ユーザーまでご利用いただけます。</p>
                    <div className="text-sm text-gray-500">使用回数: 15回</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ追加モーダル */}
          {showAddFaq && (
            <Modal onClose={() => setShowAddFaq(false)} title="FAQ追加">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="existing-category" name="category-type" checked={!isCustomCategory} onChange={() => setIsCustomCategory(false)} className="text-indigo-600" />
                      <label htmlFor="existing-category" className="text-sm">既存カテゴリから選択</label>
                    </div>
                    {!isCustomCategory && (
                      <select value={newFaq.category} onChange={(e) => setNewFaq(prev => ({...prev, category: e.target.value}))} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        {faqCategories.slice(1).map(category => (<option key={category} value={category}>{category}</option>))}
                      </select>
                    )}
                    <div className="flex items-center gap-2">
                      <input type="radio" id="custom-category" name="category-type" checked={isCustomCategory} onChange={() => setIsCustomCategory(true)} className="text-indigo-600" />
                      <label htmlFor="custom-category" className="text-sm">新しいカテゴリを作成</label>
                    </div>
                    {isCustomCategory && (
                      <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="新しいカテゴリ名を入力" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">質問</label>
                  <input type="text" value={newFaq.question} onChange={(e) => setNewFaq(prev => ({...prev, question: e.target.value}))} placeholder="よくある質問を入力してください" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">回答</label>
                  <textarea value={newFaq.answer} onChange={(e) => setNewFaq(prev => ({...prev, answer: e.target.value}))} rows="6" placeholder="回答を入力してください" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button onClick={handleAddFaq} className="w-full sm:w-auto">追加</Button>
                  <Button onClick={() => setShowAddFaq(false)} className="w-full sm:w-auto" variant="secondary">キャンセル</Button>
                </div>
              </div>
            </Modal>
          )}

          {/* データベース作成モーダル */}
          {showAddDatabase && (
            <Modal onClose={() => setShowAddDatabase(false)} title="データベース作成 - FAQ自動生成" wide>
              <div className="p-1">
                {!uploadedContent ? (
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">FAQ自動生成システム</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                      <CardUpload onChange={handleFaqFileUpload} label="ファイルをアップロード" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" icon="📁" note="PDF, Word, Excel, PowerPoint対応" />
                      <CardText onSubmit={(text)=>handleFaqTextInput(text)} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h1 className="text-lg sm:text-2xl font-bold">FAQ編集・登録画面</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">アップロードされた内容: {uploadedContent}</p>
                      </div>
                      <button onClick={() => setUploadedContent('')} className="text-gray-500 hover:text-gray-700 text-sm sm:text-base">← 戻る</button>
                    </div>

                    {/* コントロールバー */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="all">全カテゴリ</option>
                        {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                      <input type="text" placeholder="🔍 質問・回答を検索" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <div className="flex gap-2">
                        <Button onClick={addNewGeneratedFaq}>➕ 新規FAQ追加</Button>
                        <Button onClick={saveAllGeneratedFaqs} variant="primary">💾 すべて保存 ({generatedFaqs.filter(f => f.status !== 'saved' && f.similarity < 80).length}件)</Button>
                      </div>
                    </div>

                    {/* 統計 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <Stat value={generatedFaqs.length} label="総FAQ数" tone="blue" />
                      <Stat value={generatedFaqs.filter(f => f.status === 'saved').length} label="保存済み" tone="green" />
                      <Stat value={generatedFaqs.filter(f => f.status === 'edited').length} label="編集済み" tone="yellow" />
                      <Stat value={generatedFaqs.filter(f => f.similarity > 80).length} label="重複の可能性" tone="red" />
                    </div>

                    {/* 一覧 */}
                    <div className="space-y-3">
                      {isGenerating ? (
                        <div className="text-center py-10">
                          <div className="text-4xl mb-2">🤖</div>
                          <p className="text-lg font-medium">AI分析中...</p>
                          <p className="text-gray-600">網羅的なFAQを生成しています</p>
                        </div>
                      ) : (
                        filteredFaqs.map((faq) => (
                          <div key={faq.id} className={`border rounded-lg p-4 transition-all ${
                            faq.status === 'saved' ? 'bg-gray-50 border-gray-300' :
                            faq.status === 'edited' ? 'bg-yellow-50 border-yellow-300' :
                            faq.similarity > 80 ? 'bg-red-50 border-red-300' :
                            'bg-white border-gray-200'
                          }`}>
                            <div className="flex flex-col md:flex-row md:items-start gap-3">
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <input type="text" value={faq.category} onChange={(e) => updateGeneratedFaq(faq.id, 'category', e.target.value)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium focus:ring-2 focus:ring-blue-500" placeholder="カテゴリ" />
                                  {faq.status === 'edited' && <Badge tone="yellow">編集済</Badge>}
                                  {faq.status === 'saved' && <Badge tone="green">保存済</Badge>}
                                  {faq.similarity > 80 && <Badge tone="red">類似度: {faq.similarity}% - 重複の可能性</Badge>}
                                </div>
                                <input type="text" value={faq.question} onChange={(e) => updateGeneratedFaq(faq.id, 'question', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" placeholder="質問を入力" />
                                <textarea value={faq.answer} onChange={(e) => updateGeneratedFaq(faq.id, 'answer', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical" placeholder="回答を入力" rows={3} />
                                {showDuplicateWarning[faq.id] && (
                                  <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-sm">
                                    <p className="font-medium text-red-800">⚠️ 重複の可能性があります</p>
                                    <p className="text-red-700">既存のFAQと類似度が高いため、内容を確認してください。</p>
                                    <button onClick={() => { setShowDuplicateWarning({ ...showDuplicateWarning, [faq.id]: false }); saveGeneratedFaq({ ...faq, similarity: 0 });}} className="mt-2 text-red-600 underline text-sm">それでも保存する</button>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => saveGeneratedFaq(faq)} disabled={faq.status === 'saved'}>保存</Button>
                                <Button onClick={() => deleteGeneratedFaq(faq.id)} variant="danger">削除</Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          )}

          {/* AIアシストFAQ作成モーダル */}
          {showAiAssist && (
            <Modal onClose={() => setShowAiAssist(false)} title="AIアシスト FAQ作成" wide>
              <div className="space-y-6">
                {/* ファイルアップロード */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📋</span>
                    <h4 className="text-lg font-semibold text-gray-800">事業内容・提案資料をアップロード</h4>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">おすすめ</span>
                  </div>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-gray-700 mb-1 font-medium">事業紹介資料や提案書をアップロードしてください</p>
                    <p className="text-sm text-gray-600 mb-4">AIが資料を分析して、よくある質問と回答を自動生成します</p>
                    <label className="bg-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors inline-block">
                      <input type="file" multiple onChange={handleAiFileUpload} className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                      📂 資料をアップロード
                    </label>
                  </div>

                  {aiFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h5 className="font-medium text-gray-700">アップロード済み資料:</h5>
                      <div className="grid md:grid-cols-2 gap-3">
                        {aiFiles.map(file => (
                          <div key={file.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg grid place-items-center">📄</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-gray-500">{file.size}</div>
                            </div>
                            {file.processed ? (
                              <div className="text-xs text-green-600 font-medium">✅ 分析完了</div>
                            ) : (
                              <div className="text-xs text-purple-600">🔄 AI分析中...</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 生成結果 */}
                {aiGeneratedFaqs.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🤖</span>
                      <h4 className="text-lg font-semibold text-gray-800">AI生成FAQ ({aiGeneratedFaqs.length}件)</h4>
                      <span className="text-sm text-gray-600">- 内容を確認・編集してFAQに追加できます</span>
                    </div>
                    <div className="grid gap-4">
                      {aiGeneratedFaqs.map((faq, index) => (
                        <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                              <input type="text" value={faq.category} onChange={(e) => updateAiFaq(faq.id, 'category', e.target.value)} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium border-none focus:ring-2 focus:ring-purple-500 focus:bg-white" />
                              <span className="text-xs text-gray-500">ソース: {faq.source}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => addAiFaq(faq)} size="sm">✓ 追加</Button>
                              <Button onClick={() => removeAiFaq(faq.id)} size="sm" variant="danger">✕</Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">質問</label>
                              <input type="text" value={faq.question} onChange={(e) => updateAiFaq(faq.id, 'question', e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">回答</label>
                              <textarea value={faq.answer} onChange={(e) => updateAiFaq(faq.id, 'answer', e.target.value)} rows="3" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-vertical" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-3">
                      <Button onClick={() => { alert(`${aiGeneratedFaqs.length}件のFAQを一括追加しました！`); setAiGeneratedFaqs([]); setShowAiAssist(false); }}>すべてのFAQを追加 ({aiGeneratedFaqs.length}件)</Button>
                      <Button variant="secondary" onClick={() => setShowAiAssist(false)}>閉じる</Button>
                    </div>
                  </div>
                ) : (
                  aiFiles.some(f => f.processed) && (
                    <div className="text-center py-8 text-gray-500">
                      <p>資料の分析が完了しました。FAQが生成されませんでした。</p>
                      <p className="text-sm mt-1">別の資料をアップロードしてみてください。</p>
                    </div>
                  )
                )}
              </div>
            </Modal>
          )}

          {activePage === 'customers' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">顧客一覧</h1>
                <p className="text-gray-600 mt-1">登録されている顧客の管理</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                {/* ヘッダー */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">顧客リスト</h2>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <input type="text" placeholder="顧客名・会社名で検索..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Button size="sm" className="w-28">新規登録</Button>
                  </div>
                </div>

                {/* モバイル：カード、デスクトップ：テーブル */}
                <div className="md:hidden divide-y">
                  {customers.map((c, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{c.company}</div>
                          <div className="text-sm text-gray-500">{c.domain}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${c.status === '成約' ? 'bg-green-100 text-green-800' : c.status === '商談中' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{c.status}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="text-gray-700">{c.person} ・ {c.email}</div>
                        <div className="text-gray-600 mt-1">{c.industry} / 担当: {c.owner}</div>
                        <div className="text-gray-400 text-xs mt-1">最終更新: {c.updated}</div>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" variant="secondary">編集</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <Th>会社名</Th><Th>担当者</Th><Th>業種</Th><Th>ステータス</Th><Th>担当営業</Th><Th>最終更新</Th><Th>操作</Th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <Td>
                            <div className="text-sm font-medium text-gray-900">{c.company}</div>
                            <div className="text-sm text-gray-500">{c.domain}</div>
                          </Td>
                          <Td>
                            <div className="text-sm text-gray-900">{c.person}</div>
                            <div className="text-sm text-gray-500">{c.email}</div>
                          </Td>
                          <Td>{c.industry}</Td>
                          <Td>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.status === '成約' ? 'bg-green-100 text-green-800' : c.status === '商談中' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{c.status}</span>
                          </Td>
                          <Td>{c.owner}</Td>
                          <Td className="text-gray-500">{c.updated}</Td>
                          <Td><Button size="sm" variant="secondary">編集</Button></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-500">全 {customers.length} 件中 1-{customers.length} 件を表示</div>
                  <div className="flex items-center gap-3">
                    <select value={customersPerPage} onChange={(e) => setCustomersPerPage(Number(e.target.value))} className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value={50}>50件/ページ</option>
                      <option value={100}>100件/ページ</option>
                      <option value={200}>200件/ページ</option>
                    </select>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">前へ</Button>
                      <Button size="sm" variant="secondary">次へ</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 承認モーダル */}
          {showApproval && (
            <Modal onClose={() => setShowApproval(false)} title="承認待ち">
              <div className="space-y-5">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="font-semibold text-blue-900">新規メール受信</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">承認待ち</span>
                  </div>
                  <div className="ml-1 sm:ml-6">
                    <p className="text-sm text-gray-700 mb-1"><strong>送信者:</strong> 株式会社テックソリューション (tanaka@tech-solution.com)</p>
                    <p className="text-sm text-gray-700 mb-1"><strong>件名:</strong> 見積もりについて問い合わせ</p>
                    <p className="text-sm text-gray-700 mb-3"><strong>受信時刻:</strong> 2024-01-15 14:30</p>
                    <div className="bg-white rounded p-3 border text-sm">
                      <p>いつもお世話になっております。</p>
                      <p>弊社のシステム導入について、詳細な見積もりをお願いしたく連絡いたします。</p>
                      <p>ご検討のほど、よろしくお願いいたします。</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">推奨する返信内容</h4>
                  <div className="bg-white rounded p-3 border text-sm">
                    <p>田中様</p>
                    <p className="mt-2">いつもお世話になっております。</p>
                    <p className="mt-2">見積もりのご依頼をいただき、ありがとうございます。</p>
                    <p>詳細な要件をお聞かせいただけますでしょうか。</p>
                    <p className="mt-2">お時間のある時にお打ち合わせの機会をいただけますと幸いです。</p>
                    <p className="mt-2">よろしくお願いいたします。</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button>承認して送信</Button>
                  <Button variant="secondary">編集</Button>
                  <Button variant="danger">却下</Button>
                </div>
              </div>
            </Modal>
          )}

          {activePage === 'search' && (
            <div className="min-h-[50vh] bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">ナレッジ検索</h1>
                <p className="text-gray-600">困った時の頼れる相談相手</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">自由検索</h2>
                <div className="flex gap-3 mb-3">
                  <input type="text" placeholder="例：価格、競合、契約条件..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white" />
                  <Button>検索</Button>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-md font-semibold text-slate-800 mb-2">検索のヒント</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">基本情報</p>
                      <ul className="space-y-1 text-slate-600 mt-1">
                        <li>• 価格・値引き</li>
                        <li>• 競合・比較</li>
                        <li>• 契約・条件</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">サポート</p>
                      <ul className="space-y-1 text-slate-600 mt-1">
                        <li>• トラブル・障害</li>
                        <li>• 導入・研修</li>
                        <li>• 機能・実績</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">よくある状況</h2>
                <div className="space-y-3">
                  {['価格を下げろと言われた','競合他社の方が安いと言われた','決裁者がいないと言われた','システムトラブルのクレーム'].map((t,i)=>(
                    <button key={i} className={`w-full bg-white hover:shadow-md p-4 rounded-lg border-2 border-gray-300 text-left transition-all duration-200 ${t.includes('トラブル')?'ring-2 ring-red-200':''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base sm:text-lg font-medium mb-1">{t}</div>
                          {t.includes('価格') || t.includes('トラブル') ? (
                            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span><span className="text-xs sm:text-sm text-red-600">要注意</span></div>
                          ) : null}
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'database' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ナレッジDB</h1>
                <p className="text-gray-600 mt-1">データアップロードとテキスト入力でナレッジベースを構築</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">📁 ファイルアップロード</h2>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-gray-700 mb-1 font-medium">事業資料をアップロード</p>
                    <p className="text-sm text-gray-600 mb-3">PDF、Word、Excel、PowerPointファイル対応</p>
                    <label className="bg-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors inline-block">
                      <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
                      📂 ファイル選択
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">📝 テキスト入力</h2>
                  <textarea rows="10" placeholder="ナレッジとして活用したい情報を入力してください..." className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical" value={databaseText} onChange={(e)=>setDatabaseText(e.target.value)} />
                  <Button className="w-full mt-3" onClick={handleDatabaseTextSubmit}>🤖 テキストからナレッジ生成</Button>
                </div>
              </div>

              {/* 登録済みナレッジ（簡略版） */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">登録済みナレッジ</h2>
                  <div className="flex gap-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>全カテゴリ</option>
                      <option>製品情報</option>
                      <option>価格・契約</option>
                      <option>技術情報</option>
                      <option>サポート</option>
                    </select>
                    <input type="text" placeholder="ナレッジを検索..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {[
                    {cat:'製品情報', tag:'PDF', title:'Yarisugiシステム概要資料', desc:'システムの基本機能、価格体系、導入事例を含む包括的な資料。営業活動で最も利用頻度の高いドキュメント。', meta:'アップロード日: 2024-01-10 • 2.3MB'},
                    {cat:'価格・契約', tag:'テキスト', title:'料金体系と契約条件', desc:'基本料金、オプション料金、支払い条件、契約期間、解約条件などの詳細情報。', meta:'登録日: 2024-01-08 • 1,250文字'},
                    {cat:'技術情報', tag:'Word', title:'API連携仕様書', desc:'外部システムとのAPI連携に関する技術仕様や設定方法。', meta:'アップロード日: 2024-01-05 • 1.8MB'}
                  ].map((k,i)=>(
                    <div key={i} className="p-4 sm:p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{k.cat}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{k.tag}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{k.title}</h3>
                          <p className="text-sm text-gray-600">{k.desc}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">編集</Button>
                          <Button size="sm" variant="secondary">削除</Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{k.meta}</div>
                    </div>
                  ))}
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">全 28 件のナレッジが登録されています</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">前へ</Button>
                    <Button size="sm" variant="secondary">次へ</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">自社情報・提案内容管理</h1>
                <p className="text-gray-600 mt-1">自社の基本情報と提案内容を管理します</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <form className="space-y-6">
                  <SectionTitle>自社情報</SectionTitle>
                  <Field label="自社名" placeholder="例：株式会社SKYVILLAGE" />
                  <FieldArea label="自己紹介文（あいさつ文）" rows={3} placeholder="例：私たちは◯◯業界に特化した業務改善サービスを提供しています..." />
                  <FieldArea label="サービス構成" rows={2} placeholder="例：Yarisugi事務DX、広告DX、営業支援、自動レポート作成など" />
                  <FieldArea label="過去の導入実績・事例" rows={2} placeholder="例：◯◯工務店様での導入により、見積もり作成時間を50%短縮" />
                  <SectionTitle>提案内容</SectionTitle>
                  <Field label="提案目的" placeholder="例：営業効率の改善、CV率向上、現場情報の一元化など" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="提案内容（1）" placeholder="例：Yarisugi営業の導入による顧客対応の自動化" />
                    <Field label="想定金額（1）" placeholder="例：月額10万円＋初期費用25万円" />
                  </div>
                  <Field label="提案資料URL（1）" placeholder="例：https://drive.google.com/file/d/xxxxx/view" type="url" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="提案内容（2）" placeholder="例：レポート自動生成ツールの提供による提案書作成時間の短縮" />
                    <Field label="想定金額（2）" placeholder="例：月額3万円＋初期費用10万円" />
                  </div>
                  <Field label="提案資料URL（2）" placeholder="例：https://drive.google.com/file/d/yyyyy/view" type="url" />
                  <div className="pt-2">
                    <Button type="submit" size="md" className="w-full sm:w-auto">保存する</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== 小さなUI部品 ===== */
const Section = ({title, items=[]}) => (
  <div className="mb-5">
    <h3 className="text-blue-600 mb-2">{title}</h3>
    <ul className="space-y-1 pl-4 list-disc text-gray-700">
      {items.map((t,i)=><li key={i}>{t}</li>)}
    </ul>
  </div>
);
const FormGroup = ({ label, children }) => (
  <div>
    <label className="block font-semibold mb-2 text-gray-700">{label}</label>
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100" />
);
const Select = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 bg-white cursor-pointer">
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option, index) => (<option key={index} value={option}>{option}</option>))}
  </select>
);
const Th = ({ children }) => (<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>);
const Td = ({ children }) => (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>);
const Badge = ({ children, tone='gray' }) => {
  const map = { yellow:'bg-yellow-200 text-yellow-800', green:'bg-green-200 text-green-800', red:'bg-red-200 text-red-800', gray:'bg-gray-200 text-gray-800' };
  return <span className={`text-xs px-2 py-1 rounded-full ${map[tone]}`}>{children}</span>;
};
const Stat = ({ value, label, tone='blue' }) => {
  const color = {blue:'text-blue-600',green:'text-green-600',yellow:'text-yellow-600',red:'text-red-600'}[tone];
  const bg = {blue:'bg-blue-50',green:'bg-green-50',yellow:'bg-yellow-50',red:'bg-red-50'}[tone];
  return (
    <div className={`${bg} p-4 rounded-lg`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};
const SectionTitle = ({children}) => (<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">{children}</h2>);
const Field = ({label, placeholder, type='text'}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);
const FieldArea = ({label, placeholder, rows=3}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <textarea rows={rows} placeholder={placeholder} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical" />
  </div>
);
const Modal = ({children, onClose, title, wide=false}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
    <div className={`bg-white rounded-lg w-full ${wide?'max-w-6xl':'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  </div>
);
const CardUpload = ({onChange, label, accept, icon='📄', note}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors text-center">
    <div className="text-5xl mb-3">{icon}</div>
    <h2 className="text-lg font-bold mb-1">{label}</h2>
    {note && <p className="text-gray-600 mb-3">{note}</p>}
    <input type="file" onChange={onChange} className="hidden" id="faq-file-upload" accept={accept}/>
    <label htmlFor="faq-file-upload" className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block">ファイルを選択</label>
  </div>
);
const CardText = ({onSubmit}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-dashed border-green-300 hover:border-green-500 transition-colors text-center">
    <div className="text-5xl mb-3">📝</div>
    <h2 className="text-lg font-bold mb-1">テキストを入力</h2>
    <p className="text-gray-600 mb-3">サービス情報を直接入力</p>
    <button onClick={() => { const text = prompt('サービス情報を入力してください'); if (text) onSubmit(text); }} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
      テキスト入力を開始
    </button>
  </div>
);

export default YarisugiDashboard;
