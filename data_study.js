const STUDY_DATA = [
  { 
    cat: "Level Design Theory", 
    title: "레벨 디자인에서의 내비게이션 가독성 연구", 
    date: "2026. 03. 08", // 작성일 추가
    desc: "랜드마크, 조명, 색채를 활용한 유도 기법 분석. 지도 없이도 직관적으로 이동하게 하는 환경 설계.",
    coverImage: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1200&auto=format&fit=crop", // 노션 상단 커버 이미지
    
    // 👇 여기서부터 노션 본문 내용입니다.
    content: `
      <div class="m-study-quote">
        "좋은 레벨 디자인은 플레이어가 스스로 길을 찾았다고 믿게 만드는 것이다."
      </div>

      <h3 class="m-study-h3">1. 연구 배경 및 목적</h3>
      
      <p class="m-study-p">
        여기에 노션에 작성하신 연구 배경을 적어주세요. 플레이어가 튜토리얼이나 미니맵 없이도 자연스럽게 목적지를 향해 나아가게 만드는 시각적 단서(Visual Cue)들의 중요성을 탐구합니다. 엘든 링과 같은 훌륭한 오픈월드 게임들은 이러한 유도 기법을 어떻게 숨겨두었는지 분석합니다.
      </p>

      <img src="https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=1200&auto=format&fit=crop" class="m-study-img" alt="연구 이미지">
      <span class="m-study-caption">그림 1. 시선을 유도하는 조명과 랜드마크 배치 예시</span>

      <h3 class="m-study-h3">2. 핵심 분석 요소</h3>
      <p class="m-study-p">
        시선 유도를 위해 사용되는 3가지 주요 기법은 다음과 같습니다.
      </p>

      <ul class="m-study-list">
        <li><strong>빛과 그림자의 대비:</strong> 인간의 본능적으로 밝은 곳을 향하는 심리를 이용해 주 동선을 조명으로 하이라이팅.</li>
        <li><strong>거대 랜드마크 (Weenie):</strong> 화면의 1/3 이상을 차지하는 거대한 구조물을 배치하여 나침반 역할을 수행.</li>
        <li><strong>색채 심리학 (Color Coding):</strong> 상호작용 가능한 오브젝트(예: 빨간색 드럼통, 노란색 사다리)에 특정 색상을 일관되게 부여.</li>
      </ul>

      <div class="m-study-callout">
        <div class="m-study-callout-icon">💡</div>
        <div class="m-study-callout-text">
          <strong style="color:var(--fg-main);">핵심 인사이트:</strong><br>
          강제적인 텍스트 지시나 화살표보다, 플레이어가 환경을 읽고 스스로 판단하게 만드는 레벨 디자인이 가장 높은 몰입감을 제공한다. 노션에서 옮기실 때 이 박스를 활용해 요약본이나 결론을 적어보세요!
        </div>
      </div>
    `
  },
  { 
    cat: "Design Analysis", 
    title: "다크 소울 시리즈의 공간 서사 분석", 
    date: "2026. 02. 15",
    desc: "비선형 월드 디자인과 환경 스토리텔링. 레벨 연결성이 세계관 전달에 기여하는 방식 심층 분석.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    content: `
      <h3 class="m-study-h3">작성 중인 스터디입니다.</h3>
      <p class="m-study-p">이곳에 새로운 노션 글을 복사해서 넣어주세요.</p>
    `
  }
];