const STUDY_DATA = [
  { 
    cat: "Level Design Theory", 
    title: "GDC - God Of War Level Design", 
    date: "2026. 02. 13", 
    desc: "2018년작 <God Of War> '스톤 메이슨' 레벨을 통해 알아보는 레벨 디자인을 지탱하는 6가지 핵심 규칙과 개발 비하인드 분석.",
    coverImage: "https://duck3d.notion.site/image/attachment%3A0d19b8dd-a1a9-4829-a49d-9e88369eccce%3A%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2026-02-13_050951.png?table=block&id=305fcdf9-9754-80af-af84-d14438ffcbc8&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=2000&userId=&cache=v2", 
    youtubeId: "eSB29qx6sWw", 
    
    // 🔥 번역기가 헷갈리지 못하도록 빈틈없이 수정 완료! 🔥
    content: `
이 강연은 2018년작 <strong>&lt;God Of War&gt;</strong>의 레벨 디자인을 지탱하는 6가지 핵심 규칙을 ‘스톤 메이슨’ 레벨을 예시로 들어 설명하고 있습니다.

### 🎯 서론 : 목적
이 강연은 방대한 게임인 <strong>&lt;God of War&gt;</strong>의 개발 과정을 단순화하여, 다른 게임 개발자들에게도 적용될 수 있는 <strong>레벨 디자인의 6가지 규칙</strong>을 공유하는 것을 목표로 합니다. 발표자는 ‘스톤 메이슨’ 레벨이 이 6가지 규칙이 가장 잘 적용된 사례라고 소개합니다.

### 🏛️ 규칙 1 : 핵심기둥 (Core Pillars) 정의
개발 초기, 팀은 게임의 방향성을 결정짓는 <strong>핵심기둥(Core Pillars)</strong>을 정의합니다. 과거 시리즈의 기둥이 ‘전투, 플랫폼, 퍼즐’이었다면, 이번 신작의 새로운 기둥은 <strong>전투(Combat), 내러티브(Narrative), 탐험(Exploration)</strong> 3가지로 정했습니다.

이 세 가지 기둥은 모든 레벨 디자인의 기준점이 됩니다. 레벨 디자이너는 공간을 만들 때 항상 "이 공간이 전투, 내러티브, 탐험을 어떻게 충족시키는가?" 를 고민해야 합니다.

![핵심기둥3가지](https://duck3d.notion.site/image/attachment%3A02e007df-4f85-46a4-84d9-164008b33454%3Aimage.png?table=block&id=31ffcdf9-9754-8091-9285-e70cd8b6e0a3&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 1. 핵심 기둥 3가지</span>

<div class="m-study-callout"><div class="m-study-callout-icon">💡</div><div class="m-study-callout-text">
<strong>'스톤 메이슨' 레벨 적용 사례</strong><br><br>
- <strong>전투 :</strong> 다양한 아레나와 보스전 배치<br>
- <strong>내러티브 :</strong> 쓰러진 거인(스톤 메이슨) 자체가 강력한 환경적 스토리텔링 장치를 하며, 크레토스와 아트레우스의 대화가 끊기지 않도록 설계<br>
- <strong>탐험 :</strong> 단순히 맵을 넓게 만드는 것이 아니라, 카메라를 자유롭게 돌릴 수 있게 됨에 따라 구석구석 숨겨진 요소를 배치하여 플레이어가 능동적으로 찾아보게 만듦
</div></div>

### 📏 규칙 2 : 메트릭 (Metrics) - 기둥을 치수로 변환
추상적인 ‘핵심기둥’을 실제 게임 공간으로 구현하기 위해서는 구체적인 <strong>치수(Metrics)</strong>가 필요합니다. 이를 위해 <strong>‘레벨 빌딩 코드’</strong> 라는 문서를 만들어 크레토스의 이동과 상호작용 규격을 표준화하였습니다.

![치수 변환 이미지](https://duck3d.notion.site/image/attachment%3A800724b1-8d95-42b6-a68e-1362827d40a3%3Aimage.png?table=block&id=31ffcdf9-9754-80ee-b64a-c55e263bb760&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 2. 크레토스의 이동 규격과 3M 부스트</span>

- 크레토스가 벽을 타고 오르는 높이를 <strong>1M, 2M, 3M</strong> 등으로 규격화하였습니다.
- <strong>특히 3M 부스트는 가장 중요한 단위입니다.</strong> 이는 플레이어를 평면적인 공간에서 수직적으로 분리해주면서도, 흐름을 끊지 않을 정도로 적당한 높이입니다. (전투 공간 분리, 비밀 장소 숨기기에 유용)
- 이러한 치수(Metrics)가 통일되면, 플레이어는 무의식적으로 "저 높이는 올라갈 수 있겠다" 혹은 "저기는 전투 공간이다" 라는 리듬과 규칙을 자연스럽게 학습하게 되어 쾌적한 플레이가 가능해집니다.

### 🎭 규칙 3 : 다양성 확보 (Theme)
플레이어가 지루함을 느끼지 않게 하려면 모든 레벨이 각기 다른 강력한 테마를 가져야 합니다. 테마는 시각적인 것 뿐만 아니라 독특한 <strong>게임플레이 요소</strong>에서 비롯됩니다. 즉, 하나의 레벨에는 그 레벨을 관통하는 핵심 기믹이 있어야 합니다.

<div class="m-study-callout"><div class="m-study-callout-icon">🏹</div><div class="m-study-callout-text">
<strong>'스톤 메이슨' 레벨 적용 사례</strong><br><br>
이 레벨의 테마는 <strong>충격화살</strong>입니다. 레벨 전체가 붉은 수정을 폭파시키는 기믹을 중심으로 설계되어 있으며, 이러한 기믹은 플레이어로 하여금 <em>"아, 여기는 폭발하는 수정이 있는 곳이구나"</em> 라는 뚜렷한 인상을 남깁니다.
</div></div>

### 🔓 규칙 4 : 새로운 능력 해금 (Unlock a New Ability)
모든 주요 레벨은 약 <strong>90분~120분 마다 새로운 능력을 해금</strong>하도록 설계되었습니다. 새로운 능력을 얻는 것은 플레이어에게 가장 큰 보상이자 동기부여가 되며, 앞서 말한 ‘레벨의 테마’ 를 만드는 핵심 재료가 됩니다.

충격 화살은 아트레우스가 붉은 수정에 화살을 쏘면 폭발하는 단순한 메커니즘입니다. 하지만 이 단순함 덕분에 <strong>전투(광역 데미지), 탐험(길 뚫기), 내러티브(세계수 뿌리)</strong> 등 게임의 3대 기둥 모두에 적용할 수 있는 범용성을 가집니다. 단순한 능력이지만 이를 활용해 다양한 상황(퍼즐, 전투 보조)을 만들어내는 것이 레벨 디자인의 핵심입니다.

### 📐 규칙 5 : 형식과 탐험 휴식 (The Format & Exploration Break)
레벨의 흐름을 구조화하는 형식(Format)이 존재하며, 이는 일종의 <strong>‘삼각형 구조’</strong>로 설명됩니다.

![삼각형 구조](https://duck3d.notion.site/image/attachment%3Aede78bb7-d1a1-48e3-b6e8-c76f0f72b286%3Aimage.png?table=block&id=305fcdf9-9754-80c6-af76-cc6eff68938f&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 3. 레벨 디자인의 삼각형 구조</span>

- <strong>초반 75% :</strong> 해당 레벨의 테마를 충분히 경험하게 합니다.
- <strong>전환점 (Key Turning Point) :</strong> 보스전이나 중요한 사건 발생. 여기서 새로운 능력 해금.
- <strong>후반 25% :</strong> 획득한 새 능력을 가르치는 튜토리얼 구간.
- <strong>마지막 :</strong> 탐험 휴식 제공.

<strong>🏝️ 탐험 휴식의 중요성</strong>
레벨이 끝나고 플레이어를 허브(Hub)로 돌려보낼 때, "자, 이제 자유롭게 탐험해도 돼" 라고 명확한 신호를 줍니다. 새로운 능력을 얻은 직후이므로, 플레이어는 "이 능력으로 아까 못 갔던 곳을 가볼까?" 하는 자발적인 동기가 생깁니다. 복잡한 길 찾기나 스토리 진행의 압박을 주지 않아 온전히 탐험에만 집중하게 배려하는 <strong>메트로이드배니아 스타일</strong>의 탐험 유도 방식입니다.

### 🕸️ 규칙 6 : 허브는 오픈 월드가 아니다 (Hubs are Not Open World)
<strong>&lt;God Of War&gt;</strong>의 ‘아홉의 호수’는 오픈 월드가 아닌 <strong>허브(Hub) 구조</strong>입니다.

![허브 구조](https://duck3d.notion.site/image/attachment%3Adc31c2f3-b1b5-40f0-98ea-3c3df6ddd75b%3Aimage.png?table=block&id=31ffcdf9-9754-8094-a6c0-ee16787e3f0b&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 4. 허브 구조 예시</span>

- <strong>중심 (Center) :</strong> 티르의 신전 같은 중앙 거점.
- <strong>바퀴살 (Spokes) :</strong> 중심에서 뻗어 나가는 통로들.
- <strong>도착지 (Endpoints) :</strong> 각 레벨이나 던전.

플레이어는 중심에서 출발해 바퀴살(통로)을 지나 레벨(도착지)을 클리어하고, 다시 중심으로 돌아옵니다. 돌아올 때는 '새로운 능력'을 가진 상태이므로 허브 곳곳에 숨겨진 비밀을 새로 풀 수 있게 됩니다. 허브는 단순한 이동 공간이 아닌 <strong>레벨과 레벨 사이의 흐름을 연결하고 탐험 욕구를 증폭시키는 장치</strong>입니다.

---

### 🚧 개발 이슈
발표자는 개발 과정에서 발생한 충돌과 해결 과정도 공유합니다.

- <strong>퍼즐의 위치 :</strong> 퍼즐은 3대 핵심 기둥에 포함되진 않았지만, 게임의 흐름을 조절하고 동료와의 협동을 보여주며 전투 기술을 연습시키는 중요한 도구로 기능했습니다.
- <strong>치수 vs 예술 :</strong> 명확한 높이(치수)를 원하는 기획자와 수풀/장식을 넣고 싶은 아티스트 간의 의견 충돌. ➔ <strong>수풀 스타일 가이드</strong>를 만들어 갈 수 있는 곳과 없는 곳을 수풀 배치로 구분하는 타협점을 찾음.
- <strong>후반부의 다양성 :</strong> 게임 후반부에는 새로운 능력을 추가할 예산/시간이 부족함. ➔ 기존 능력들을 섞어서(예: 충격 화살 + 함정) 숙련도를 시험하는 방식으로 다양성 확보.
- <strong>완벽한 원형 허브의 불가능 :</strong> 원래 허브는 완벽한 원형을 의도했으나, 자연스러운 환경을 위해 모양이 찌그러짐. ➔ 대신 <strong>탑(Tower)</strong>을 배치하여 시각적인 랜드마크 역할을 하게 함으로써 구조적 명확성을 확보.

> "제약이 창의성을 만든다."

### 💡 나의 생각
'제약이 창의성을 만든다'라는 말이 매우 흥미롭습니다. <strong>'컷신이 없다'</strong>는 제약은 로딩마저 게임플레이로 승화시켰고, <strong>'점프 버튼이 없다'</strong>는 제약은 오히려 플레이어가 '도끼'라는 도구 하나에 완벽하게 숙달될 수 있게 만들었습니다.

또한, 엄격한 수치와 규격은 겉보기에는 창의성을 해치는 것처럼 보일 수 있지만, 실제로는 플레이어가 길을 잃지 않게 만드는 <strong>‘무의식적 가이드라인’</strong>이 되었습니다. 이 덕분에 UI나 미니맵 없이도 쾌적한 게임이 가능했습니다. 동료(아트레우스) 역시 단순한 짐덩어리가 아닌 핵심 기둥의 일부로 통합시키며 서사와 시스템을 완벽하게 일치시킨 점이 놀랍습니다.
`
  },
  { 
    cat: "Design Analysis", 
    title: "다크 소울 시리즈의 공간 서사 분석", 
    date: "2026. 02. 15",
    desc: "비선형 월드 디자인과 환경 스토리텔링. 레벨 연결성이 세계관 전달에 기여하는 방식 심층 분석.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    content: `
### 📝 작성 중인 스터디입니다.
이곳에 새로운 노션 글을 복사해서 넣어주세요.
    `
  }
];