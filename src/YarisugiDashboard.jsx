import React, { useState } from 'react';

const YarisugiDashboard = () => {
  const [activePage, setActivePage] = useState('top');
  const [showApproval, setShowApproval] = useState(false);
  const [customersPerPage, setCustomersPerPage] = useState(50);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddDatabase, setShowAddDatabase] = useState(false);
  const [showAiAssist, setShowAiAssist] = useState(false);
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

  const showReportPreview = () => {
    setShowReport(true);
  };

  const showApprovalScreen = () => {
    setShowApproval(true);
  };

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
          {
            category: '料金・価格',
            question: `基本料金はいくらですか？`,
            answer: `基本料金は月額50,000円からとなっております。ご利用規模やオプション機能により価格が変動いたします。詳細なお見積りについてはお問い合わせください。`
          },
          {
            category: '料金・価格',
            question: `初期費用は必要ですか？`,
            answer: `初期導入費用として100,000円を頂戴しております。これには初回設定、データ移行、操作研修が含まれます。`
          },
          {
            category: 'サービス内容・機能',
            question: `どのような機能が利用できますか？`,
            answer: `顧客管理、売上分析、レポート作成、自動化機能、API連携など、豊富な機能をご利用いただけます。詳細な機能一覧は資料をご確認ください。`
          },
          {
            category: 'サービス内容・機能',
            question: `カスタマイズは可能ですか？`,
            answer: `はい、お客様のご要望に応じてカスタマイズ対応が可能です。追加開発費用については別途お見積りいたします。`
          },
          {
            category: '導入・設定',
            question: `導入までどのくらいの期間が必要ですか？`,
            answer: `標準的な導入期間は2-4週間程度です。お客様の環境やデータ量により前後する場合があります。`
          }
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
        if (!faqCategories.includes(category)) {
          setFaqCategories(prev => [...prev, category]);
        }
      });
      
      setAiFiles(prev => 
        prev.map(f => newFiles.find(nf => nf.id === f.id) ? {...f, processed: true} : f)
      );
    }, 3000);
  };

  const updateAiFaq = (id, field, value) => {
    setAiGeneratedFaqs(prev => 
      prev.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    );
  };

  const addAiFaq = (faq) => {
    alert(`FAQ追加完了！\nカテゴリ: ${faq.category}\n質問: ${faq.question}`);
    setAiGeneratedFaqs(prev => prev.filter(f => f.id !== faq.id));
  };

  const removeAiFaq = (id) => {
    setAiGeneratedFaqs(prev => prev.filter(faq => faq.id !== id));
  };

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
      setDatabaseFiles(prev => 
        prev.map(f => newFiles.find(nf => nf.id === f.id) ? {...f, processed: true} : f)
      );
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

  // FAQBuilder関連の関数
  const generateComprehensiveFAQs = () => {
    setIsGenerating(true);
        
    setTimeout(() => {
      const comprehensiveFaqs = [
        { id: 1, category: '基本情報', question: 'サービスの概要を教えてください', answer: '当社のサービスは、クラウドベースの統合管理システムです。', status: 'new', similarity: 0 },
        { id: 2, category: '基本情報', question: '対応業種は何ですか？', answer: '製造業、小売業、サービス業など幅広い業種に対応しています。', status: 'new', similarity: 0 },
        { id: 3, category: '基本情報', question: '会社の設立はいつですか？', answer: '2010年に設立し、15年以上の実績があります。', status: 'new', similarity: 0 },
        { id: 4, category: '料金・プラン', question: '料金プランの種類を教えてください', answer: 'スタータープラン、スタンダードプラン、エンタープライズプランの3種類をご用意しています。', status: 'new', similarity: 0 },
        { id: 5, category: '料金・プラン', question: '無料トライアルはありますか？', answer: '30日間の無料トライアルをご利用いただけます。', status: 'new', similarity: 0 },
        { id: 6, category: '料金・プラン', question: '支払い方法は何がありますか？', answer: '銀行振込、クレジットカード、口座振替に対応しています。', status: 'new', similarity: 0 },
        { id: 7, category: '料金・プラン', question: '月払いと年払いの違いは？', answer: '年払いの場合、2ヶ月分の割引が適用されます。', status: 'new', similarity: 0 },
        { id: 8, category: '機能・仕様', question: '主要機能を教えてください', answer: '顧客管理、在庫管理、売上分析、レポート作成などの機能があります。', status: 'new', similarity: 0 },
        { id: 9, category: '機能・仕様', question: 'モバイル対応していますか？', answer: 'iOS/Androidアプリをご用意しており、外出先でも利用可能です。', status: 'new', similarity: 0 },
        { id: 10, category: '機能・仕様', question: 'API連携は可能ですか？', answer: 'RESTful APIを提供しており、他システムとの連携が可能です。', status: 'new', similarity: 0 },
        { id: 11, category: '機能・仕様', question: 'データのエクスポートはできますか？', answer: 'CSV、Excel、PDF形式でのエクスポートに対応しています。', status: 'new', similarity: 0 },
        { id: 12, category: '導入・設定', question: '導入に必要な期間は？', answer: '規模により異なりますが、通常2-4週間で導入完了します。', status: 'new', similarity: 0 },
        { id: 13, category: '導入・設定', question: '既存システムからの移行は可能ですか？', answer: '専門チームがデータ移行をサポートいたします。', status: 'new', similarity: 0 },
        { id: 14, category: '導入・設定', question: '必要な環境を教えてください', answer: 'インターネット接続環境があれば利用可能です。', status: 'new', similarity: 0 },
        { id: 15, category: 'セキュリティ', question: 'セキュリティ対策について教えてください', answer: 'SSL暗号化、二要素認証、定期的なセキュリティ監査を実施しています。', status: 'new', similarity: 0 },
        { id: 16, category: 'セキュリティ', question: 'データのバックアップは？', answer: '毎日自動バックアップを実施し、過去30日分を保持しています。', status: 'new', similarity: 0 },
        { id: 17, category: 'セキュリティ', question: 'アクセス権限の管理は？', answer: '役職・部署単位での細かなアクセス権限設定が可能です。', status: 'new', similarity: 0 },
        { id: 18, category: 'サポート', question: 'サポート体制について教えてください', answer: '平日9-18時の電話・メールサポートに加え、24時間対応の緊急窓口もあります。', status: 'new', similarity: 0 },
        { id: 19, category: 'サポート', question: '操作マニュアルはありますか？', answer: 'オンラインマニュアルと動画チュートリアルをご用意しています。', status: 'new', similarity: 0 },
        { id: 20, category: 'サポート', question: '研修は受けられますか？', answer: '導入時研修と定期的なフォローアップ研修を実施しています。', status: 'new', similarity: 0 },
        { id: 21, category: '契約・解約', question: '契約期間の縛りはありますか？', answer: '最低契約期間は1年間、その後は月単位での更新となります。', status: 'new', similarity: 85 },
        { id: 22, category: '契約・解約', question: '解約時のデータはどうなりますか？', answer: '解約後30日間はデータのダウンロードが可能です。', status: 'new', similarity: 0 },
        { id: 23, category: '契約・解約', question: 'プラン変更は可能ですか？', answer: 'いつでも上位プランへの変更が可能です。', status: 'new', similarity: 0 },
      ];

      const uniqueCategories = [...new Set(comprehensiveFaqs.map(faq => faq.category))];
      setCategories(uniqueCategories);
      setGeneratedFaqs(comprehensiveFaqs);
      setIsGenerating(false);
    }, 2000);
  };

  const handleFaqFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedContent(`ファイル: ${file.name} がアップロードされました`);
    }
  };

  const handleFaqTextInput = (text) => {
    if (text.trim()) {
      setUploadedContent(text);
    }
  };

  const updateGeneratedFaq = (id, field, value) => {
    setGeneratedFaqs(prev =>
      prev.map(faq => faq.id === id ? { ...faq, [field]: value, status: 'edited' } : faq)
    );
  };

  const deleteGeneratedFaq = (id) => {
    setGeneratedFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  const addNewGeneratedFaq = () => {
    const newFaq = {
      id: Date.now(),
      category: selectedCategory === 'all' ? '新規カテゴリ' : selectedCategory,
      question: '',
      answer: '',
      status: 'new',
      similarity: 0
    };
    setGeneratedFaqs(prev => [newFaq, ...prev]);
  };

  const saveGeneratedFaq = (faq) => {
    if (faq.similarity > 80) {
      setShowDuplicateWarning({ ...showDuplicateWarning, [faq.id]: true });
      return;
    }
        
    alert(`FAQ登録完了:\nカテゴリ: ${faq.category}\n質問: ${faq.question}`);
    setGeneratedFaqs(prev => prev.map(f =>
      f.id === faq.id ? { ...f, status: 'saved' } : f
    ));
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

  // uploadedContentが変更されたときにFAQ生成を実行
  React.useEffect(() => {
    if (uploadedContent) {
      generateComprehensiveFAQs();
    }
  }, [uploadedContent]);

  const generateProposal = () => {
    alert('レポートを抽出しています...');
  };

  const StatCard = ({ value, label, icon }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
      <div className="flex-1">
        <div className="text-2xl font-bold text-indigo-600 mb-1">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
      <div className="w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
        {icon}
      </div>
    </div>
  );

  const FormGroup = ({ label, children }) => (
    <div className="mb-6">
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>
      {children}
    </div>
  );

  const Input = ({ value, onChange, placeholder, type = "text" }) => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100"
    />
  );

  const Select = ({ value, onChange, options, placeholder }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 bg-white cursor-pointer"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );

  const Button = ({ onClick, variant = 'primary', size = 'md', children }) => {
    const baseClasses = "font-semibold cursor-pointer transition-all border-none rounded-lg";
    const variants = {
      primary: "bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      danger: "bg-red-500 text-white hover:bg-red-600"
    };
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      >
        {children}
      </button>
    );
  };

  const NavItem = ({ label, page, active, onClick }) => (
    <>
      <div
        onClick={() => onClick(page)}
        className={`flex items-center px-6 py-4 cursor-pointer transition-all text-sm relative ${
          active 
            ? 'bg-indigo-500 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-400' 
            : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        <span>{label}</span>
      </div>
      <div className="border-b border-slate-600/30 mx-4"></div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* ヘッダー */}
      <div className="bg-white shadow-md px-8 py-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
        <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Yarisugi
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative cursor-pointer text-xl">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <Button>CSVエクスポート</Button>
        </div>
      </div>

      <div className="flex mt-16 h-screen">
        {/* サイドバー */}
        <div className="w-64 bg-slate-800 text-slate-200 py-6 overflow-y-auto">
          <NavItem label="トップページ" page="top" active={activePage === 'top'} onClick={setActivePage} />
          <NavItem label="顧客一覧" page="customers" active={activePage === 'customers'} onClick={setActivePage} />
          <NavItem label="FAQ設定" page="faq" active={activePage === 'faq'} onClick={setActivePage} />
          <NavItem label="ナレッジ検索" page="search" active={activePage === 'search'} onClick={setActivePage} />
          <NavItem label="ナレッジDB" page="database" active={activePage === 'database'} onClick={setActivePage} />
          <NavItem label="基本情報入力" page="profile" active={activePage === 'profile'} onClick={setActivePage} />
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activePage === 'top' && (
            <div>
              {/* 新規顧客登録 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">新規顧客登録</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormGroup label="会社名">
                    <Input
                      value={formData.companyName}
                      onChange={(value) => handleInputChange('companyName', value)}
                      placeholder="株式会社〇〇"
                    />
                  </FormGroup>
                  
                  <FormGroup label="顧客名（担当者名）">
                    <Input
                      value={formData.customerName}
                      onChange={(value) => handleInputChange('customerName', value)}
                      placeholder="田中一郎"
                    />
                  </FormGroup>
                  
                  <FormGroup label="所在地">
                    <Input
                      value={formData.location}
                      onChange={(value) => handleInputChange('location', value)}
                      placeholder="東京都渋谷区"
                    />
                  </FormGroup>
                  
                  <FormGroup label="業種">
                    <Select
                      value={formData.industry}
                      onChange={(value) => handleInputChange('industry', value)}
                      placeholder="選択してください"
                      options={['製造業', 'IT・通信', '小売・流通', '建設・不動産', 'サービス業', '金融・保険', '医療・福祉', 'その他']}
                    />
                  </FormGroup>
                  
                  <FormGroup label="サイトURL">
                    <Input
                      type="url"
                      value={formData.siteUrl}
                      onChange={(value) => handleInputChange('siteUrl', value)}
                      placeholder="https://example.com"
                    />
                  </FormGroup>
                  
                  <FormGroup label="SNS運用状況">
                    <Select
                      value={formData.snsStatus}
                      onChange={(value) => handleInputChange('snsStatus', value)}
                      placeholder="選択してください"
                      options={[
                        '積極的に運用中（毎日投稿）',
                        '定期的に運用中（週2-3回）',
                        'たまに更新（月数回）',
                        'アカウントはあるが更新なし',
                        'SNS未運用'
                      ]}
                    />
                  </FormGroup>
                  
                  <FormGroup label="LINE ID">
                    <Input
                      value={formData.lineId}
                      onChange={(value) => handleInputChange('lineId', value)}
                      placeholder="@example_line"
                    />
                  </FormGroup>
                  
                  <FormGroup label="メールアドレス">
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      placeholder="example@email.com"
                    />
                  </FormGroup>
                  
                  <FormGroup label="担当営業">
                    <Select
                      value={formData.salesPerson}
                      onChange={(value) => handleInputChange('salesPerson', value)}
                      options={['山田太郎', '佐藤花子', '鈴木一郎']}
                    />
                  </FormGroup>
                  
                  <FormGroup label="ステータス">
                    <Select
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      options={['新規', '商談中', '成約', '失注']}
                    />
                  </FormGroup>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button>接続開始</Button>
                  <Button onClick={showReportPreview}>レポートを抽出</Button>
                  <Button variant="secondary">キャンセル</Button>
                </div>
              </div>

              {/* メール自動化セクション */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">📧 メール・LINE自動化</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 最新の受信メール */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-blue-700 mb-4 flex items-center gap-2">
                      <span>🔔</span>
                      <span>最新の受信メール</span>
                    </h3>
                    <div className="bg-white rounded-md p-4 mb-4 cursor-pointer hover:bg-gray-50" onClick={showApprovalScreen}>
                      <p className="font-semibold mb-2">株式会社テックソリューション</p>
                      <p className="text-sm text-gray-600">件名: 見積もりについて問い合わせ</p>
                      <p className="text-xs text-gray-400">受信: 10分前</p>
                    </div>
                    <Button size="sm">返信テンプレート選択</Button>
                  </div>

                  {/* 最新のLINEメッセージ */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-green-700 mb-4 flex items-center gap-2">
                      <span>💬</span>
                      <span>最新のLINEメッセージ</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-md p-4 cursor-pointer hover:bg-gray-50">
                        <p className="font-semibold mb-2">佐藤花子（グローバル商事）</p>
                        <p className="text-sm text-gray-600">メッセージ: 来週の打ち合わせの件で...</p>
                        <p className="text-xs text-gray-400">受信: 25分前</p>
                      </div>
                      <div className="bg-white rounded-md p-4 cursor-pointer hover:bg-gray-50">
                        <p className="font-semibold mb-2">鈴木次郎（製造工業）</p>
                        <p className="text-sm text-gray-600">メッセージ: 資料ありがとうございました</p>
                        <p className="text-xs text-gray-400">受信: 1時間前</p>
                      </div>
                    </div>
                    <Button size="sm">個別LINE選択</Button>
                  </div>
                </div>
              </div>

              {/* レポートプレビュー */}
              {showReport && (
                <div className="bg-gray-100 rounded-xl p-8 mt-8">
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">顧客分析レポート</h2>
                    
                    <div className="mb-8">
                      <h3 className="text-blue-600 mb-4">🎯 ターゲット分析</h3>
                      <ul className="space-y-2 pl-4">
                        <li>• 主要ターゲット: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">中小企業（従業員50-200名）</span></li>
                        <li>• 地域特性: 首都圏を中心とした都市部展開</li>
                        <li>• 業界動向: デジタル化推進により需要拡大傾向</li>
                      </ul>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-blue-600 mb-4">💰 収益予測</h3>
                      <ul className="space-y-2 pl-4">
                        <li>• 月額契約単価: <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">¥50,000-¥150,000</span></li>
                        <li>• 年間LTV: <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">¥800,000</span></li>
                        <li>• 成約予測: 3ヶ月以内の確率 <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">75%</span></li>
                      </ul>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-blue-600 mb-4">📊 競合分析</h3>
                      <ul className="space-y-2 pl-4">
                        <li>• 競合他社: 大手3社との差別化ポイント明確</li>
                        <li>• 価格優位性: 同等サービスより20%コスト削減可能</li>
                        <li>• 技術優位性: AI活用による自動化レベルが高い</li>
                      </ul>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button>詳細レポートをダウンロード</Button>
                      <Button variant="secondary" onClick={() => setShowReport(false)}>閉じる</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'faq' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">FAQ管理システム</h1>
                <p className="text-gray-600 mt-2">FAQ追加とデータベース作成のモーダル機能</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex gap-4 mb-8">
                  <button 
                    onClick={() => setShowAddFaq(true)}
                    className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    + FAQ追加
                  </button>
                  <button 
                    onClick={() => setShowAddDatabase(true)}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    📚 データベース作成
                  </button>
                  <button 
                    onClick={() => setShowAiAssist(true)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    ✨ AIアシスト FAQ作成
                  </button>
                </div>

                {/* 既存FAQ表示エリア */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">既存のFAQ</h2>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">料金</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">手動追加</span>
                    </div>
                    <h3 className="font-semibold mb-2">Q: 基本プランの料金はいくらですか？</h3>
                    <p className="text-gray-700 mb-2">A: 基本プランは月額50,000円で10ユーザーまでご利用いただけます。</p>
                    <div className="text-sm text-gray-500">使用回数: 15回</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ追加モーダル */}
          {showAddFaq && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">FAQ追加</h3>
                    <button 
                      onClick={() => setShowAddFaq(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="existing-category"
                          name="category-type"
                          checked={!isCustomCategory}
                          onChange={() => setIsCustomCategory(false)}
                          className="text-indigo-600"
                        />
                        <label htmlFor="existing-category" className="text-sm">既存カテゴリから選択</label>
                      </div>
                      {!isCustomCategory && (
                        <select 
                          value={newFaq.category}
                          onChange={(e) => setNewFaq(prev => ({...prev, category: e.target.value}))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {faqCategories.slice(1).map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="custom-category"
                          name="category-type"
                          checked={isCustomCategory}
                          onChange={() => setIsCustomCategory(true)}
                          className="text-indigo-600"
                        />
                        <label htmlFor="custom-category" className="text-sm">新しいカテゴリを作成</label>
                      </div>
                      {isCustomCategory && (
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="新しいカテゴリ名を入力"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">質問</label>
                    <input 
                      type="text"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq(prev => ({...prev, question: e.target.value}))}
                      placeholder="よくある質問を入力してください"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">回答</label>
                    <textarea 
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq(prev => ({...prev, answer: e.target.value}))}
                      rows="6"
                      placeholder="回答を入力してください"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleAddFaq}
                      className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      追加
                    </button>
                    <button 
                      onClick={() => setShowAddFaq(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* データベース作成モーダル */}
          {showAddDatabase && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">データベース作成 - FAQ自動生成</h3>
                    <button 
                      onClick={() => setShowAddDatabase(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {!uploadedContent ? (
                    <div>
                      <h1 className="text-3xl font-bold mb-8 text-center">FAQ自動生成システム</h1>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* ファイルアップロード */}
                        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
                          <div className="text-center">
                            <div className="text-6xl mb-4">📁</div>
                            <h2 className="text-xl font-bold mb-2">ファイルをアップロード</h2>
                            <p className="text-gray-600 mb-4">PDF, Word, Excel, PowerPoint対応</p>
                            <input
                              type="file"
                              onChange={handleFaqFileUpload}
                              className="hidden"
                              id="faq-file-upload"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                            <label
                              htmlFor="faq-file-upload"
                              className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block"
                            >
                              ファイルを選択
                            </label>
                          </div>
                        </div>

                        {/* テキスト入力 */}
                        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
                          <div className="text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-xl font-bold mb-2">テキストを入力</h2>
                            <p className="text-gray-600 mb-4">サービス情報を直接入力</p>
                            <button
                              onClick={() => {
                                const text = prompt('サービス情報を入力してください');
                                if (text) handleFaqTextInput(text);
                              }}
                              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              テキスト入力を開始
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h1 className="text-2xl font-bold">FAQ編集・登録画面</h1>
                          <p className="text-gray-600 mt-1">アップロードされた内容: {uploadedContent}</p>
                        </div>
                        <button
                          onClick={() => setUploadedContent('')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ← 戻る
                        </button>
                      </div>

                      {/* コントロールバー */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">全カテゴリ</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="🔍 質問・回答を検索"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          onClick={addNewGeneratedFaq}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          ➕ 新規FAQ追加
                        </button>

                        <button
                          onClick={saveAllGeneratedFaqs}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          💾 すべて保存 ({generatedFaqs.filter(f => f.status !== 'saved' && f.similarity < 80).length}件)
                        </button>
                      </div>

                      {/* 統計情報 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{generatedFaqs.length}</div>
                          <div className="text-sm text-gray-600">総FAQ数</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {generatedFaqs.filter(f => f.status === 'saved').length}
                          </div>
                          <div className="text-sm text-gray-600">保存済み</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {generatedFaqs.filter(f => f.status === 'edited').length}
                          </div>
                          <div className="text-sm text-gray-600">編集済み</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {generatedFaqs.filter(f => f.similarity > 80).length}
                          </div>
                          <div className="text-sm text-gray-600">重複の可能性</div>
                        </div>
                      </div>

                      {/* FAQ一覧 */}
                      <div className="space-y-4">
                        {isGenerating ? (
                          <div className="text-center py-12">
                            <div className="text-4xl mb-4">🤖</div>
                            <p className="text-lg font-medium">AI分析中...</p>
                            <p className="text-gray-600">網羅的なFAQを生成しています</p>
                          </div>
                        ) : (
                          filteredFaqs.map((faq) => (
                            <div
                              key={faq.id}
                              className={`border rounded-lg p-4 transition-all ${
                                faq.status === 'saved' ? 'bg-gray-50 border-gray-300' :
                                faq.status === 'edited' ? 'bg-yellow-50 border-yellow-300' :
                                faq.similarity > 80 ? 'bg-red-50 border-red-300' :
                                'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={faq.category}
                                      onChange={(e) => updateGeneratedFaq(faq.id, 'category', e.target.value)}
                                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500"
                                      placeholder="カテゴリ"
                                    />
                                    {faq.status === 'edited' && (
                                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">編集済</span>
                                    )}
                                    {faq.status === 'saved' && (
                                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">保存済</span>
                                    )}
                                    {faq.similarity > 80 && (
                                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                                        類似度: {faq.similarity}% - 重複の可能性
                                      </span>
                                    )}
                                  </div>

                                  <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => updateGeneratedFaq(faq.id, 'question', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="質問を入力"
                                  />

                                  <textarea
                                    value={faq.answer}
                                    onChange={(e) => updateGeneratedFaq(faq.id, 'answer', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
                                    placeholder="回答を入力"
                                    rows={3}
                                  />

                                  {showDuplicateWarning[faq.id] && (
                                    <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-sm">
                                      <p className="font-medium text-red-800">⚠️ 重複の可能性があります</p>
                                      <p className="text-red-700">既存のFAQと類似度が高いため、内容を確認してください。</p>
                                      <button
                                        onClick={() => {
                                          setShowDuplicateWarning({ ...showDuplicateWarning, [faq.id]: false });
                                          saveGeneratedFaq({ ...faq, similarity: 0 });
                                        }}
                                        className="mt-2 text-red-600 underline text-sm"
                                      >
                                        それでも保存する
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveGeneratedFaq(faq)}
                                    disabled={faq.status === 'saved'}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                  >
                                    保存
                                  </button>
                                  <button
                                    onClick={() => deleteGeneratedFaq(faq.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    削除
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AIアシストFAQ作成モーダル */}
          {showAiAssist && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      <h3 className="text-xl font-bold">AIアシスト FAQ作成</h3>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">おすすめ</span>
                    </div>
                    <button 
                      onClick={() => setShowAiAssist(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* ファイルアップロード セクション */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📋</span>
                      <h4 className="text-lg font-semibold text-gray-800">事業内容・提案資料をアップロード</h4>
                    </div>
                    
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-gray-700 mb-2 font-medium">事業紹介資料や提案書をアップロードしてください</p>
                      <p className="text-sm text-gray-600 mb-4">AIが資料を分析して、よくある質問と回答を自動生成します</p>
                      <label className="bg-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors inline-block">
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleAiFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        📂 資料をアップロード
                      </label>
                    </div>

                    {/* アップロード済みファイル */}
                    {aiFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h5 className="font-medium text-gray-700">アップロード済み資料:</h5>
                        <div className="grid md:grid-cols-2 gap-3">
                          {aiFiles.map(file => (
                            <div key={file.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                📄
                              </div>
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

                  {/* AI生成FAQ一覧 */}
                  {aiGeneratedFaqs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl">🤖</span>
                        <h4 className="text-lg font-semibold text-gray-800">AI生成FAQ ({aiGeneratedFaqs.length}件)</h4>
                        <span className="text-sm text-gray-600">- 内容を確認・編集してFAQに追加できます</span>
                      </div>

                      <div className="grid gap-4">
                        {aiGeneratedFaqs.map((faq, index) => (
                          <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                                <input
                                  type="text"
                                  value={faq.category}
                                  onChange={(e) => updateAiFaq(faq.id, 'category', e.target.value)}
                                  className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium border-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                                />
                                <span className="text-xs text-gray-500">ソース: {faq.source}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => addAiFaq(faq)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs flex items-center gap-1"
                                >
                                  ✓ 追加
                                </button>
                                <button
                                  onClick={() => removeAiFaq(faq.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">質問</label>
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => updateAiFaq(faq.id, 'question', e.target.value)}
                                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">回答</label>
                                <textarea
                                  value={faq.answer}
                                  onChange={(e) => updateAiFaq(faq.id, 'answer', e.target.value)}
                                  rows="3"
                                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-vertical"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600">💡</span>
                          <h5 className="font-semibold text-green-800">AIアシスト機能の特徴</h5>
                        </div>
                        <ul className="text-green-700 text-sm space-y-1">
                          <li>• 事業資料から自動的にFAQを生成</li>
                          <li>• カテゴリの自動分類と新規作成</li>
                          <li>• 質問と回答の編集が可能</li>
                          <li>• 一括でFAQデータベースに追加</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {aiGeneratedFaqs.length === 0 && aiFiles.some(f => f.processed) && (
                    <div className="text-center py-8 text-gray-500">
                      <p>資料の分析が完了しました。FAQが生成されませんでした。</p>
                      <p className="text-sm mt-2">別の資料をアップロードしてみてください。</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6 border-t">
                    <button 
                      onClick={() => setShowAiAssist(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      閉じる
                    </button>
                    {aiGeneratedFaqs.length > 0 && (
                      <button 
                        onClick={() => {
                          const count = aiGeneratedFaqs.length;
                          alert(`${count}件のFAQを一括追加しました！`);
                          setAiGeneratedFaqs([]);
                          setShowAiAssist(false);
                        }}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        すべてのFAQを追加 ({aiGeneratedFaqs.length}件)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'customers' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">顧客一覧</h1>
                <p className="text-gray-600 mt-2">登録されている顧客の管理</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">顧客リスト</h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="顧客名・会社名で検索..."
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button size="sm">新規登録</Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業種</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当営業</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終更新</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">株式会社テックソリューション</div>
                          <div className="text-sm text-gray-500">tech-solution.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">田中一郎</div>
                          <div className="text-sm text-gray-500">tanaka@tech-solution.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">IT・通信</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">商談中</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">山田太郎</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="secondary">編集</Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">株式会社グローバル商事</div>
                          <div className="text-sm text-gray-500">global-trading.co.jp</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">佐藤花子</div>
                          <div className="text-sm text-gray-500">sato@global-trading.co.jp</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">小売・流通</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">成約</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">佐藤花子</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-12</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="secondary">編集</Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">株式会社製造工業</div>
                          <div className="text-sm text-gray-500">manufacturing.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">鈴木次郎</div>
                          <div className="text-sm text-gray-500">suzuki@manufacturing.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">製造業</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">新規</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">鈴木一郎</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-10</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="secondary">編集</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      全 3 件中 1-3 件を表示
                    </div>
                    <select
                      value={customersPerPage}
                      onChange={(e) => setCustomersPerPage(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={50}>50件/ページ</option>
                      <option value={100}>100件/ページ</option>
                      <option value={200}>200件/ページ</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">前へ</Button>
                    <Button size="sm" variant="secondary">次へ</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showApproval && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">承認待ち</h2>
                  <button
                    onClick={() => setShowApproval(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-blue-900">新規メール受信</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">承認待ち</span>
                    </div>
                    <div className="ml-6">
                      <p className="text-sm text-gray-700 mb-2"><strong>送信者:</strong> 株式会社テックソリューション (tanaka@tech-solution.com)</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>件名:</strong> 見積もりについて問い合わせ</p>
                      <p className="text-sm text-gray-700 mb-4"><strong>受信時刻:</strong> 2024-01-15 14:30</p>
                      
                      <div className="bg-white rounded p-3 border text-sm">
                        <p>いつもお世話になっております。</p>
                        <p>弊社のシステム導入について、詳細な見積もりをお願いしたく連絡いたします。</p>
                        <p>ご検討のほど、よろしくお願いいたします。</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">推奨する返信内容</h4>
                    <div className="bg-white rounded p-3 border text-sm">
                      <p>田中様</p>
                      <p className="mt-2">いつもお世話になっております。</p>
                      <p className="mt-2">見積もりのご依頼をいただき、ありがとうございます。</p>
                      <p>詳細な要件をお聞かせいただけますでしょうか。</p>
                      <p className="mt-2">お時間のある時にお打ち合わせの機会をいただけますと幸いです。</p>
                      <p className="mt-2">よろしくお願いいたします。</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button>承認して送信</Button>
                    <Button variant="secondary">編集</Button>
                    <Button variant="danger">却下</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'search' && (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">ナレッジ検索</h1>
                  <p className="text-gray-600">困った時の頼れる相談相手</p>
                </div>

                {/* 検索セクション */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">自由検索</h2>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="例：価格、競合、契約条件..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                    />
                    <Button>検索</Button>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-md font-semibold text-slate-800 mb-3">検索のヒント</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-2">
                        <p className="font-medium text-slate-700">基本情報</p>
                        <ul className="space-y-1 text-slate-600">
                          <li>• 価格・値引き</li>
                          <li>• 競合・比較</li>
                          <li>• 契約・条件</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-slate-700">サポート</p>
                        <ul className="space-y-1 text-slate-600">
                          <li>• トラブル・障害</li>
                          <li>• 導入・研修</li>
                          <li>• 機能・実績</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 状況別ナレッジ */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">よくある状況</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-white hover:shadow-md p-4 rounded-lg border-2 border-gray-300 text-left transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium mb-1">価格を下げろと言われた</div>
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm text-red-600">要注意</span>
                          </div>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                      </div>
                    </button>
                    
                    <button className="w-full bg-white hover:shadow-md p-4 rounded-lg border-2 border-gray-300 text-left transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium mb-1">競合他社の方が安いと言われた</div>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                      </div>
                    </button>
                    
                    <button className="w-full bg-white hover:shadow-md p-4 rounded-lg border-2 border-gray-300 text-left transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium mb-1">決裁者がいないと言われた</div>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                      </div>
                    </button>
                    
                    <button className="w-full bg-white hover:shadow-md p-4 rounded-lg border-2 border-gray-300 text-left transition-all duration-200 ring-2 ring-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium mb-1">システムトラブルのクレーム</div>
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm text-red-600">要注意</span>
                          </div>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'database' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">ナレッジDB</h1>
                <p className="text-gray-600 mt-2">データアップロードとテキスト入力でナレッジベースを構築</p>
              </div>

              {/* アップロードエリア */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* ファイルアップロード */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">📁 ファイルアップロード</h2>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-gray-700 mb-2 font-medium">事業資料をアップロード</p>
                    <p className="text-sm text-gray-600 mb-4">PDF、Word、Excel、PowerPointファイル対応</p>
                    <label className="bg-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors inline-block">
                      <input 
                        type="file" 
                        multiple 
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      📂 ファイル選択
                    </label>
                  </div>
                </div>

                {/* テキスト入力 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 テキスト入力</h2>
                  <textarea 
                    rows="12"
                    placeholder="製品の特徴、サービス内容、価格情報、操作方法、よくある問題と解決策など、ナレッジとして活用したい情報を入力してください。

例：
- 製品名：○○システム
- 価格：月額50,000円〜
- 機能：顧客管理、売上分析、レポート作成
- サポート：平日9-18時
- 導入期間：約2週間
- 実績：1000社以上の導入実績..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                  />
                  <Button className="w-full mt-4">🤖 テキストからナレッジ生成</Button>
                </div>
              </div>

              {/* 既存ナレッジ一覧 */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">登録済みナレッジ</h2>
                  <div className="flex gap-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>全カテゴリ</option>
                      <option>製品情報</option>
                      <option>価格・契約</option>
                      <option>技術情報</option>
                      <option>サポート</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ナレッジを検索..."
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  <div className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">製品情報</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">PDF</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Yarisugiシステム概要資料</h3>
                        <p className="text-sm text-gray-600">システムの基本機能、価格体系、導入事例を含む包括的な資料。営業活動で最も利用頻度の高いドキュメント。</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="secondary">編集</Button>
                        <Button size="sm" variant="secondary">削除</Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>アップロード日: 2024-01-10</span> • <span>ファイルサイズ: 2.3MB</span>
                    </div>
                  </div>

                  <div className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">価格・契約</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">テキスト</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">料金体系と契約条件</h3>
                        <p className="text-sm text-gray-600">基本料金、オプション料金、支払い条件、契約期間、解約条件などの詳細情報。顧客からの価格に関する質問への回答に使用。</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="secondary">編集</Button>
                        <Button size="sm" variant="secondary">削除</Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>登録日: 2024-01-08</span> • <span>文字数: 1,250文字</span>
                    </div>
                  </div>

                  <div className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">技術情報</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Word</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">API連携仕様書</h3>
                        <p className="text-sm text-gray-600">外部システムとのAPI連携に関する技術仕様、連携可能なシステム一覧、設定方法などの技術文書。</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="secondary">編集</Button>
                        <Button size="sm" variant="secondary">削除</Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>アップロード日: 2024-01-05</span> • <span>ファイルサイズ: 1.8MB</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    全 28 件のナレッジが登録されています
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">前へ</Button>
                    <Button size="sm" variant="secondary">次へ</Button>
                  </div>
                </div>
              </div>

              {/* 説明 */}
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-600">🤖</span>
                  <h5 className="font-semibold text-purple-800">ナレッジDB機能について</h5>
                </div>
                <p className="text-purple-700 text-sm mb-2">
                  アップロードされたファイルやテキストをAIが解析し、検索しやすい形でナレッジベースに蓄積します。
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• ファイル：PDF、Word、Excel、PowerPointから情報を抽出・構造化</li>
                  <li>• テキスト：入力内容を自動でカテゴライズして保存</li>
                  <li>• 検索：キーワード検索、カテゴリ検索で必要な情報を素早く発見</li>
                  <li>• FAQ連携：ナレッジからFAQを自動生成することも可能</li>
                </ul>
              </div>
            </div>
          )}

          {activePage === 'profile' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">自社情報・提案内容管理</h1>
                <p className="text-gray-600 mt-2">自社の基本情報と提案内容を管理します</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <form className="space-y-8">
                  {/* 自社情報 */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">自社情報</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">自社名</label>
                        <input 
                          type="text" 
                          placeholder="例：株式会社SKYVILLAGE"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">自己紹介文（あいさつ文）</label>
                        <textarea 
                          rows="3" 
                          placeholder="例：私たちは◯◯業界に特化した業務改善サービスを提供しています..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">サービス構成</label>
                        <textarea 
                          rows="2" 
                          placeholder="例：Yarisugi事務DX、広告DX、営業支援、自動レポート作成など"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">過去の導入実績・事例</label>
                        <textarea 
                          rows="2" 
                          placeholder="例：◯◯工務店様での導入により、見積もり作成時間を50%短縮"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 提案内容 */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">提案内容</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">提案目的</label>
                        <input 
                          type="text" 
                          placeholder="例：営業効率の改善、CV率向上、現場情報の一元化など"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">提案内容（1）</label>
                          <input 
                            type="text" 
                            placeholder="例：Yarisugi営業の導入による顧客対応の自動化"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">想定金額（1）</label>
                          <input 
                            type="text" 
                            placeholder="例：月額10万円＋初期費用25万円"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">提案資料URL（1）</label>
                        <input 
                          type="url" 
                          placeholder="例：https://drive.google.com/file/d/xxxxx/view"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">提案内容（2）</label>
                          <input 
                            type="text" 
                            placeholder="例：レポート自動生成ツールの提供による提案書作成時間の短縮"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">想定金額（2）</label>
                          <input 
                            type="text" 
                            placeholder="例：月額3万円＋初期費用10万円"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">提案資料URL（2）</label>
                        <input 
                          type="url" 
                          placeholder="例：https://drive.google.com/file/d/yyyyy/view"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button type="submit" size="md">保存する</Button>
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

export default YarisugiDashboard;