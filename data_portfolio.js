const PORTFOLIO_DATA = [
  {
    id: "project-ss",
    title: "Project SS",
    desc: "공격과 패링으로 적의 체간을 쌓아 인살로 마무리하는 3인칭 액션 게임 데모입니다. 전투와 이동 기능, 제작 도구를 함께 구현했습니다.",
    tags: ["!게임 기획", "Unreal Engine 5", "AI 협업", "플레이 가능 데모"],
    youtubeId: "23m7CR67wzs",
    thumb: "img/ProjectSS/demo-play.jpg",
    demoUrl: "https://drive.google.com/file/d/1flOpIT7x2gmjcHBgCb9Mo25hWXaSFSph/view?usp=sharing",
    uiPreviewUrl: "projects/project-ss/ui/index.html",
    uiPreviewImage: "img/ProjectSS/ui-preview.jpg",
    pdfUrl: "pdf/ProjectSS_Portfolio.pdf",
    projectOverview: {
      genre: "3인칭 액션",
      engine: "Unreal Engine 5",
      role: "게임 기획 · 구현 검토",
      summary: "전투와 이동의 핵심 기능을 체험할 수 있는 데모입니다. 레퍼런스와 기획 조건을 정리하고, AI가 구현한 결과를 직접 플레이하며 수정 방향을 판단했습니다.",
      highlights: [
        { title: "체간을 쌓아 인살로", desc: "공격과 패링으로 적의 체간을 쌓고, 인살로 마무리하는 전투를 구현했습니다." },
        { title: "핵심 기능을 체험하는 데모", desc: "전투와 훅·월런 등 이동 기능을 차례로 체험하도록 구간을 나누고 동선을 연결했습니다." },
        { title: "직접 조정하는 제작 도구", desc: "적 생성과 세부 설정, 노티파이 미리보기와 디버그 도구로 수정과 확인을 돕습니다." }
      ]
    },
    overviewImages: ["img/ProjectSS/demo-play.jpg", "img/ProjectSS/demo-route.jpg", "img/ProjectSS/designer-tools.jpg"]
  },
  {
    title: "Leador",
    date: "2025.07.01 — 2026.05.21",
    desc: "소울라이크 오픈월드 액션RPG",
    tags: ["!ELDEN RING", "Unreal Engine 5", "Dark Fantasy", "창작"],
    youtubeMain: "JuzBbLGLK4A", // 👈 메인 영상 ID
    youtubeSub: "2a_eilEKhUQ", // 👈 서브 영상 ID (업로드 후 수정해주세요!)
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "pdf/김기덕_오픈월드ARPG 레벨기획서.pdf",
    //mapUrl: "Maps/leadormap/map.html",
    overviewImages: [
      "img/LD/ov/01.png",
      "img/LD/ov/02.png",
      "img/LD/ov/03.png",
      "img/LD/ov/04.png",
      "img/LD/ov/05.png",
      "img/LD/ov/06.png",
      "img/LD/ov/07.png",
      "img/LD/ov/08.png",
      "img/LD/ov/09.png"
    ],
    processImages: [
      "img/LD/pc/C_01.png",
      "img/LD/pc/C_02.png",
      "img/LD/pc/C_03.png",
      "img/LD/pc/C_04.png",
      "img/LD/pc/C_05.png",
      "img/LD/pc/N_01.png",
      "img/LD/pc/N_02.png",
      "img/LD/pc/N_03.png",
      "img/LD/pc/Q_01.png",
      "img/LD/pc/Q_02.png",
      "img/LD/pc/Q_03.png",
      "img/LD/pc/Q_04.png",
      "img/LD/pc/Q_05.png",
      "img/LD/pc/Q_08.png"
    ],
    meta: {
      genre: "오픈월드 액션RPG",
      size: "800 x 1000 x 800",
      story: "멈춰버린 세계 속, 잔향자는 산산조각 난 에텔의 심장을 되찾기 위한 순례를 떠난다.",
      intent1: { title: "자발적 탐험", desc: "플레이어의 호기심이 자발적인 탐험으로 이어지도록 공간 설계" },
      intent2: { title: "환경 내러티브", desc: "텍스트에 의존하지 않고, 공간으로 이야기 맥락 전달" },
      intent3: { title: "선택이 서사를 만든다", desc: "목표로 향하는 경로를 다각화하여, 플레이어마다 고유한 경험을 구축" }
    },
  },
  {
    title: "Left To Decay",
    date: "2025.03.21 — 2025.04.07",
    desc: "3인칭 액션 어드벤처",
    tags: ["!The Last of Us™", "Unreal Engine 5", "포스트 아포칼립스", "창작"],
    youtubeId: "sKNml5GIzbo",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "pdf/김기덕_액션어드벤처 레벨기획서.pdf",
    overviewImages: [
      "img/LTD/ov/01.png",
      "img/LTD/ov/02.png",
      "img/LTD/ov/03.png",
      "img/LTD/ov/04.png",
      "img/LTD/ov/05.png",
      "img/LTD/ov/06.png"
    ],
    processImages: [
      "img/LTD/pc/01.png",
      "img/LTD/pc/02.png",
      "img/LTD/pc/03.png",
      "img/LTD/pc/04.png",
      "img/LTD/pc/05.png",
      "img/LTD/pc/06.png",
      "img/LTD/pc/07.png",
      "img/LTD/pc/08.png"
    ],
    meta: {
      genre: "3인칭 액션 어드벤처",
      size: "255 x 310 x 55",
      story: "붕괴된 도시를 탐색하며 가족의 흔적을 찾아가는 여정",
      intent1: { title: "내러티브", desc: "시퀀스에 따라 플레이어 동선과 이벤트를 자연스럽게 연결" },
      intent2: { title: "전투,탐험,퍼즐 구간의 조화", desc: "전투의 긴장감, 탐험의 몰입감을 유기적으로 엮는 구성" },
      intent3: { title: "시선 유도", desc: "랜드마크, POI, 조명 등 별도의 설명 없이 플레이 동선을 유도하는 설계" }
    },
  },
  {
    title: "Nova Core",
    date: "2025.01.04 — 2025.02.02",
    desc: "3인칭 잠입 액션",
    tags: ["!Tom Clancy’s : Splinter Cell", "Unreal Engine 5","설산", "창작"],
    youtubeId: "otSQADvZ9pM",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "pdf/김기덕_잠입액션 레벨기획서.pdf",
    overviewImages: [
      "img/NC/ov/01.png",
      "img/NC/ov/02.png",
      "img/NC/ov/03.png",
      "img/NC/ov/04.png",
      "img/NC/ov/05.png",
      "img/NC/ov/06.png",
      "img/NC/ov/07.png",
      "img/NC/ov/08.png",
      "img/NC/ov/09.png",
      "img/NC/ov/10.png"
    ],
    processImages: [
      "img/NC/pc/01.png",
      "img/NC/pc/02.png",
      "img/NC/pc/03.png",
      "img/NC/pc/04.png",
      "img/NC/pc/05.png"
    ],
    meta: {
      genre: "3인칭 잠입 액션",
      size: "210 x 170 x 40",
      story: "눈 덮인 산속 연구소에서 비밀을 밝혀내기 위해 시작되는 잠입 작전 ",
      intent1: { title: "스텔스 경험", desc: "플레이어가 최대한 신중하고 천천히 진행하도록 유도하는 스텔스 레벨 설계" },
      intent2: { title: "동적인 환경", desc: "적AI 순찰 루트, 해킹 가능한 문, 달려오는 트럭, 기차 등 플레이어의 행동 혹은 선택에 따라 반응 할 수있는 레벨 설계" },
      intent3: { title: "다중 경로 제공", desc: "은밀하게 우회하거나 위험을 감수하고 빠르게 돌파하는 등, 플레이 스타일에 맞는 전략적 플레이 가능" }
    },
  }
];