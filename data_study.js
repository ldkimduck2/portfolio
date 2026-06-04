const STUDY_DATA = [
  {
  cat: "System Design & AI Workflow",
  title: "AI 파트너십을 통한 시스템 역기획: 레벨 디자인의 근거를 찾는 실험",
  date: "2026. 06",
  desc: "단순한 공간 구성을 넘어, 소울라이크 전투 시스템을 AI와 함께 역기획하며 시스템적 이해가 실제 레벨 디자인에 어떻게 강력한 무기가 될 수 있는지 검증해 나가는 실험 기록입니다.",
  coverImage: "img/DSP/DarkSoulsProject_Big_720.png",
  youtubeId: "3H-1v8gK5qM",

  content: `
> **"본 프로젝트는 AI를 활용해 소울라이크 전투 시스템을 역기획하고, 이러한 시스템적 이해도가 실제 레벨 디자인에 어떠한 강점으로 작용하는지 검증하는 실험입니다."**

이 문서는 **DarkSoulUE5** 프로젝트의 시스템 설계 과정과, 생성형 AI를 실무 파이프라인에 적용하여 C++ 기반의 엔진 스펙(Component, AnimNotify, State Tree)을 직접 역기획해 낸 연구 기록입니다.

아래 뷰어에서 기획서 원본을 직접 확인하실 수 있습니다.

<div class="m-pdf-wrap" style="margin-top: 32px; margin-bottom: 64px;">
  <iframe src="pdf/김기덕_다크소울시스템기획서.pdf" title="DarkSoulUE5 기획서" allowfullscreen></iframe>
</div>

### 🧠 1. 시스템 역기획과 레벨 디자인의 연결

레벨 디자인은 단순히 공간을 꾸미는 것이 아니라, **엔진의 논리적 규칙과 수치(Metrics) 위에서 플레이어의 경험을 통제하는 작업**입니다. AI를 파트너 삼아 복잡한 소울라이크 시스템을 직접 코어 단위로 역기획하는 이 과정은, **'시스템에 대한 깊은 이해'가 향후 탄탄한 레벨 디자인을 전개하는 데 있어 얼마나 강력한 강점이 될 수 있는지 스스로 검증해 나가는 실험**입니다.

- **스태미나 경제와 공간의 거리(Metrics):** \`AC_Status\`의 \`MaxStamina\`(기본 100), 스프린트 소모율(\`SprintCost\` 10/sec), 구르기 소모(\`DodgeStaminaCost\` 15), 회복 딜레이(\`StaminaRegenDelay\` 1.5초) 수치를 직접 분석함으로써, 화톳불 간의 간격과 인카운터 구역의 크기를 짐작이 아닌 '정확한 수치'를 바탕으로 설계할 수 있는 근거를 마련합니다.
- **전투 매니저와 다대일 전투 템포:** 여러 적의 동시 공격을 조율하는 \`CombatManagerSubsystem\`과, 공격 후 쿨다운(\`AttackCooldown\` 기본 3초) 및 게걸음 간보기 확률(\`CirclingChance\` 60%)의 원리를 이해하여, 몬스터 배치 밀도와 병목(Choke point) 구간을 정교하게 다듬는 기획적 시야를 확보합니다.

---

### ⚙️ 2. C++ 기반 컴포넌트 아키텍처 (Component Architecture)

유지보수와 확장을 고려하여 플레이어와 적 모두 철저한 **C++ 컴포넌트 기반 아키텍처**로 분리하여 설계했습니다. 특히 \`EnemyBase\`가 \`AC_Enemy\` 컴포넌트 하나의 \`bIsBoss\` 플래그 분기만으로 일반 적과 보스를 동일한 구조에서 처리한다는 점이 이 아키텍처의 핵심입니다 — 보스 전용 클래스를 따로 만들지 않고도 보스 이름(\`BossName\`), 전용 체력바(\`BossHealthBarClass\`), 입장 트리거(\`ActivateBossFight()\`)가 조건부로 활성화됩니다.

| C++ 클래스명 | 적용 대상 | 핵심 책임 (Responsibility) |
| :--- | :--- | :--- |
| **\`AC_Status.cpp\`** | 플레이어·적 | HP·스태미나·강인도(Poise)·소울·에스트 병·장비·행동 상태(15종 bool) 통합 관리 |
| **\`AC_State.cpp\`** | 플레이어·적 | \`EActionState\` Enum — Idle / Attacking / Dodging / Blocking / Parrying / Staggered / Executing / BeingExecuted |
| **\`AC_HitReaction.cpp\`** | 플레이어·적 | \`FHitPayload\`를 수신해 피격 방향 × 공격 유형 × 높이 조합으로 모션을 동적 디스패치 |
| **\`AC_Hitbox.cpp\`** | 플레이어·적 | 무기 히트박스 활성화·비활성화 제어 |
| **\`AC_Enemy.cpp\`** | 적 전용 | 배회 방식(\`EPeacefulBehavior\`)·전투 대치·감지 반경·특수공격(\`FSpecialAttackData\`) 파라미터 세팅 변수 집합. \`bIsBoss\` 플래그로 일반 적과 보스를 단일 구조에서 분기 |
| **\`AC_LockOn.cpp\`** | 플레이어 전용 | 락온 타겟 탐색·좌우 전환 및 \`AC_DynamicCamera\` 거리/회전 연동 |

---

### 🎬 3. 프레임 단위 전투 제어: AnimNotify 시스템

치밀한 공방의 핵심인 액션의 '판정'을 언리얼 엔진의 애니메이션 몽타주 **AnimNotify / AnimNotifyState**를 활용해 C++ 클래스 단에서 프레임 단위로 제어하도록 설계했습니다.

\`ANS_HitResult\`가 공격 활성 구간 동안 구체 스윕(Sphere Sweep, 반경 15cm)으로 적중을 감지하면, **\`FHitPayload\`** 구조체 — \`DamageAmount\`, \`PoiseDamage\`, \`AttackType\`, \`HitHeight\`, \`HitDirection\`, \`WeaponType\` 을 한 번에 묶어 피격 측 \`AC_HitReaction\`에 전달합니다. \`AC_HitReaction\`은 이 페이로드를 받아 공격 유형 → 방향 → 높이 순으로 테이블을 내려가며 최종 모션 하나를 결정합니다. 즉 \`FHitPayload\`는 공격 측과 피격 측을 연결하는 **전투 데이터 버스**입니다.

- **\`ANS_Invincibility\` & \`ANS_ParryWindow\`:** 구르기 무적 프레임 구간 및 패링 유효 윈도우(\`ParryStaminaCost\` 10 소모) 프레임 단위 설정.
- **\`ANS_ExecutableWindow\`:** 패링 성공 → \`bIsExecutable = true\` 활성화 구간. 이 상태의 적에게 공격 입력 시 앞잡(리포스트) 판정으로 전환됩니다.
- **\`ANS_ChargeWindow\`:** 차징 공격 입력 수용 구간 제어 (최대 차징 시간 \`MaxChargeTime\` 1.5초).
- **\`AN_EnableCombo\` & \`AN_ResetCombo\`:** 공격 선입력 버퍼(\`InputQueueWindow\` 0.5초) 수용 및 콤보 인덱스(\`CurrentComboIndex\`) 순환·초기화 제어.
- **\`ANS_SendAlert\`:** 공격 발동 시 주변 적에게 \`AlertLevel\`을 전파하여 군집 전투 참여 유도.
- **\`ANS_AI_Rotate\` & \`ANS_ModifyPlayRate\`:** AI 공격 중 플레이어 방향 추적 회전 및 공격 속도 동적 조절.

---

### ⚔️ 3-1. 처형 시스템: 패링 → 리포스트 / 백스탭

처형은 이 프로젝트에서 가장 정교하게 구현된 메커니즘입니다. \`AC_Status::ExecuteAttack()\` 내부에서 두 가지 처형 조건을 동시에 판별합니다.

<div class="m-study-callout"><div class="m-study-callout-icon">🗡️</div><div class="m-study-callout-text">
<strong>처형 판별 플로우 (AC_Status::ExecuteAttack 내부)</strong><br><br>
1. <strong>앞잡(리포스트) 조건 :</strong> 적의 \`bIsExecutable == true\` — 패링 성공 후 \`ANS_ExecutableWindow\`가 활성화한 그로기 상태.<br>
2. <strong>뒤잡(백스탭) 조건 :</strong> \`FVector::DotProduct(PlayerToEnemy, EnemyForward) > 0.5f\` — 플레이어가 적의 후방 약 60° 이내에 위치. \`bIsInvincible\` 상태가 아닌 경우에만 유효.<br>
3. <strong>애니메이션 동기화 :</strong> 두 조건이 충족되면 플레이어 측(\`FatalStrikeMontage\` 또는 \`BackstabStrikeMontage\`)과 적 측(\`ExecutedMontage\` 또는 \`BackstabbedMontage\`)이 동시에 재생되며, 적 AI의 \`BrainComponent\`는 \`StopLogic("BeingExecuted")\`로 즉시 정지됩니다.<br>
4. <strong>데미지 :</strong> 리포스트 \`RiposteDamage\`(기본 150) / 백스탭 \`BackstabDamage\`(기본 120) — 모두 \`WeaponDataAsset\`에서 무기별로 독립 설정.
</div></div>

---

### 🤖 4. State Tree 기반 다층 적 AI 행동 설계

전통적인 Behavior Tree를 넘어, UE5의 최신 **State Tree** 시스템을 채택하여 \`STEvaluator_EnemyCombat\`을 통해 전투 상황을 평가하고 유기적인 행동을 설계했습니다.

<div class="m-study-callout"><div class="m-study-callout-icon">⚔️</div><div class="m-study-callout-text">
<strong>C++ 커스텀 태스크(Task) 행동 루프</strong><br><br>
1. <strong>평화 배회 (\`STTask_Idle\`) :</strong> Stand Still 또는 무작위 위치·웨이포인트 순찰(\`EPeacefulBehavior\` / \`EWanderingStyle\`) 중 선택.<br>
2. <strong>수색 (\`STTask_MoveToLocation\`) :</strong> 시각·청각(\`UAISenseConfig_Sight\` / \`Hearing\`) 자극 감지 시 \`LastKnownLocation\`으로 이동하여 \`LookAroundCount\`(기본 3회) 두리번거림. 수색 실패 시 \`SpawnLocation\`으로 복귀.<br>
3. <strong>전투 대치 (\`STTask_StandOff\`) :</strong> 플레이어 주변을 \`CirclingChance\`(60%) 확률로 \`CirclingDuration\`(4초) 동안 게걸음 치며 간을 보는 텐션 제어.<br>
4. <strong>접근 (\`STTask_Approach\` / \`STTask_GuardApproach\`) :</strong> \`MeleeAttackRange\`(200cm) 이내 진입 시 공격 전환.<br>
5. <strong>공격 (\`STTask_Attack\`) :</strong> Random 또는 Sequential 순서로 몽타주 재생. \`FSpecialAttackData\`로 체력·거리 조건부 특수기 발동.<br>
6. <strong>그로기 (\`STTask_Groggy\`) :</strong> 강인도(Poise) 파괴 시 경직 유지 — 처형 취약 상태 진입.<br>
7. <strong>쿨다운 (\`STTask_Wait\`) :</strong> 공격 후 \`AttackCooldown\`(기본 3초) 적용 후 대치 재개.
</div></div>

---

### 🛡️ 5. 자원 경제와 환경 상호작용

- **DataAsset 기반 무기 모듈화 (\`WeaponData.cpp\`):** \`UWeaponDataAsset\`으로 무기 타입(\`EWeaponType\`: Protector·GreatSword·Axe·Nodachi), 약공격·강공격·앞잡·뒤잡 데미지, 스태미나 소비, 콤보 몽타주 배열, 애니메이션 레이어(\`LinkedAnimLayerClass\`), 강인도 데미지, 근력 스케일링(\`StrengthScalingPercentage\`)을 C++ 수정 없이 디자이너가 직관적으로 세팅.
- **소울 드랍 & 회수 (\`DroppedRune.cpp\`):** 사망 시 \`CurrentSouls\`를 \`DroppedRune\` 오브젝트로 스폰. \`SoulsGameInstance\`가 \`DroppedSoulsAmount\` + \`DroppedRuneLocation\` + \`bHasDroppedRune\` 세 값을 씬 전환 후에도 런타임에서 유지합니다 — 별도 세이브 파일 없이 GameInstance가 임시 세이브 계층을 담당하는 구조입니다. 레벨 디자인 관점에서는 이 구조 덕분에 씬(레벨) 경계를 자유롭게 나눌 수 있고, 룬 위치만 기억하면 되므로 전환 비용이 낮습니다.
- **화톳불 (\`Bonfire.cpp\`):** 점화(\`bIsLit\`) 시 거점 등록. 휴식 시 HP 전량·\`CurrentEstus\` → \`MaxEstus\`(기본 3개) 충전, \`EnemySpawner\`를 통해 주변 적 리스폰. \`LastBonfireTransform\`을 동일한 \`SoulsGameInstance\`에 보존 — 룬 드랍 위치와 마지막 화톳불 위치가 한 객체 안에서 관리되는 설계입니다.
- **사다리 (\`Ladder.cpp\`):** 상·하단 상호작용 존 독립 설계로 양방향 탑승·하차. \`SlideDownSpeed\`(기본 800cm/s) 고속 하강 및 \`SlideMontage\` 재생 지원. \`InstancedStaticMeshComponent\`로 에디터에서 높이·디딤 간격(\`StepHeight\`) 동적 설정.

---

> **"이러한 시스템적 구조화와 C++ 코어 레벨의 반복 검증 과정을 AI와 함께 수행하면서, 저는 단순한 맵 배치를 넘어 게임의 논리적 규칙과 템포를 완벽하게 융합하는 레벨 디자이너로 성장하고 있습니다."**
`
},
/// Next ///

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
}
];