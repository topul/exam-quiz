export interface FillQuestion {
  type: "fill";
  context: string;
  codeLines: string[];
  blanks: { index: number; answer: string[]; hint: string }[];
  explanation: string;
}

export interface CodeBlockQuestion {
  type: "codeblock";
  title: string;
  fileName: string;
  codeLines: string[]; // use ____ as blank marker (matched to blanks[] by order of appearance)
  blanks: { answer: string[]; hint: string }[];
  explanations: string[]; // per-blank explanation, same order as blanks[]
}

export interface MultiQuestion {
  type: "multi";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface EssayQuestion {
  type: "essay";
  question: string;
  hint: string;
  reference: string[];
}

export type Question = (
  | FillQuestion
  | CodeBlockQuestion
  | MultiQuestion
  | EssayQuestion
) & {
  project: string;
};

export const PROJECTS = [
  "项目1：健康检查与自愈",
  "项目2：数据清洗",
  "项目3：标注质检",
  "项目4：自动驾驶",
] as const;

export const PROJECT_SHORT: Record<string, string> = {
  "项目1：健康检查与自愈": "项目1",
  "项目2：数据清洗": "项目2",
  "项目3：标注质检": "项目3",
  "项目4：自动驾驶": "项目4",
};

export const questions: Question[] = [
  // ===== 项目1: 健康检查与自愈 =====
  {
    project: "项目1：健康检查与自愈",
    type: "codeblock",
    title: "代码填空：health_check_self_healing.py",
    fileName: "health_check_self_healing.py",
    codeLines: [
      "import requests",
      "import subprocess",
      "import time",
      "import logging",
      "import json",
      "import sys",
      "from datetime import datetime",
      "",
      'SERVICE_URL = "http://localhost:8080/recommend"',
      "CHECK_INTERVAL = 30",
      "FAILURE_THRESHOLD = 3",
      'RESTART_COMMAND = ["docker", "restart", "rec-model"]',
      'ALERT_WEBHOOK = "https://hooks.slack.com/xxx"',
      "",
      "logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')",
      "logger = logging.getLogger(__name__)",
      "",
      "failure_count = 0",
      "",
      "def send_alert(msg):",
      '    payload = {"text": f"[ALERT] {msg}"}',
      "    try:",
      "        # 填空1：超时时间（秒）",
      "        requests.post(ALERT_WEBHOOK, json=payload, timeout=____)",
      "    except:",
      "        pass",
      "",
      "def check_health():",
      "    try:",
      '        payload = {"user_id": "test_user"}',
      "        start = time.time()",
      "        # 填空2：超时时间（秒）",
      "        response = requests.post(SERVICE_URL, json=payload, timeout=____)",
      "        latency = (time.time() - start) * 1000",
      "",
      "        if response.status_code != 200:",
      '            return False, latency, f"HTTP {response.status_code}"',
      "",
      "        result = response.json()",
      "        # 填空3：判断recommendations是否为空（填一个关键字）",
      '        if ____ result.get("recommendations"):',
      '            return False, latency, "empty recommendations"',
      "",
      "        if latency > 2000:",
      '            return False, latency, "slow response"',
      "",
      "        return True, latency, None",
      "    except Exception as e:",
      "        return False, 0, str(e)",
      "",
      "def get_cpu_usage():",
      "    try:",
      "        result = subprocess.run(",
      '            ["docker", "stats", "rec-model", "--no-stream", "--format", "{{.CPUPerc}}"],',
      "            capture_output=True,",
      "            text=True,",
      "            # 填空4：是否检查命令执行状态（填参数名）",
      "            ____=True",
      "        )",
      "        cpu_str = result.stdout.strip().rstrip('%')",
      "        return float(cpu_str)",
      "    except:",
      "        return 0.0",
      "",
      "def self_heal(error_msg):",
      "    global failure_count",
      "    failure_count += 1",
      '    logger.warning(f"失败次数: {failure_count}/{FAILURE_THRESHOLD}")',
      "",
      "    if failure_count >= FAILURE_THRESHOLD:",
      '        send_alert("重启容器中...")',
      "        # 填空5：执行重启命令（填变量名）",
      "        subprocess.run(____, check=False)",
      "        time.sleep(10)",
      "        failure_count = 0",
      "",
      "        healthy, _, _ = check_health()",
      "        if healthy:",
      '            send_alert("重启成功")',
      "            return True",
      "        else:",
      '            send_alert("重启失败")',
      "            # 填空6：退出脚本并返回错误码1",
      "            ____",
      "    return False",
      "",
      "def rotate_log():",
      "    import os",
      '    if os.path.exists("/var/log/model_health.log"):',
      '        if os.path.getsize("/var/log/model_health.log") > 1024 * 1024:',
      "            backup = f'/var/log/model_health.log.{datetime.now().strftime(\"%Y%m%d\")}'",
      "            # 填空7：重命名文件（填函数名）",
      '            os.____("/var/log/model_health.log", backup)',
      '            logger.info("日志已轮转")',
      "",
      "def record_metrics(healthy, latency, cpu, error):",
      "    record = {",
      "        # 填空8：获取ISO格式时间戳（填方法名）",
      '        "time": datetime.now().____(),',
      '        "healthy": healthy,',
      '        "latency_ms": latency,',
      '        "cpu_percent": cpu,',
      '        "error": error',
      "    }",
      '    with open("/var/log/metrics.jsonl", "a") as f:',
      "        # 填空9：将字典转为JSON字符串（填函数调用）",
      '        f.write(____ + "\\n")',
      "",
      "def main():",
      "    rotate_log()",
      '    logger.info("启动健康检查")',
      "",
      "    while True:",
      "        healthy, latency, err = check_health()",
      "        cpu = get_cpu_usage()",
      "        record_metrics(healthy, latency, cpu, err)",
      "",
      "        global failure_count",
      "        if healthy:",
      "            failure_count = 0",
      '            logger.info(f"健康 | 延迟:{latency:.0f}ms CPU:{cpu:.1f}%")',
      "        else:",
      '            logger.warning(f"不健康: {err}")',
      "            self_heal(err)",
      "",
      "        # 填空10：等待间隔（填变量名）",
      "        time.sleep(____)",
      "",
      'if __name__ == "__main__":',
      "    main()",
    ],
    blanks: [
      { answer: ["2"], hint: "告警超时是一个较小的数字，单位秒" },
      { answer: ["3"], hint: "比告警超时稍大一点" },
      { answer: ["not"], hint: "Python中用什么关键字对值取反？" },
      { answer: ["check"], hint: "这个参数让命令执行失败时抛出异常" },
      { answer: ["RESTART_COMMAND"], hint: "文件顶部定义的大写常量" },
      { answer: ["sys.exit(1)"], hint: "用 sys 模块的哪个方法退出程序？" },
      { answer: ["rename"], hint: "os 模块中用于重命名的函数" },
      { answer: ["isoformat"], hint: "ISO 格式的英文是什么？" },
      { answer: ["json.dumps(record)"], hint: "json 模块中哪个方法把对象转字符串？" },
      { answer: ["CHECK_INTERVAL"], hint: "文件顶部定义的秒数常量" },
    ],
    explanations: [
      "timeout=2。告警请求超时设为2秒，告警不是关键路径。",
      "timeout=3。健康检查需要等模型推理返回，超时设为3秒。",
      "not。not result.get('recommendations') 在值为 None/空列表时返回 True。",
      "check=True。命令返回非零退出码时抛出 CalledProcessError。",
      'RESTART_COMMAND。文件开头定义的重启命令变量 ["docker", "restart", "rec-model"]。',
      "sys.exit(1)。sys.exit() 退出程序，参数 1 表示非正常退出。",
      "os.rename()。将当前日志文件重命名为带日期后缀的备份文件。",
      "isoformat()。datetime 的 isoformat() 返回 ISO 8601 格式时间字符串。",
      "json.dumps(record)。dumps = dump string，将字典序列化为 JSON 字符串。",
      "CHECK_INTERVAL。值为 30 秒，是两次健康检查之间的等待间隔。",
    ],
  },
  {
    project: "项目1：健康检查与自愈",
    type: "multi",
    question: "自愈策略的三步骤正确顺序是？",
    options: [
      "A. 流量热切换(止血) → 自动修复(治病) → 快照告警(叫医生)",
      "B. 快照告警 → 流量热切换 → 自动修复",
      "C. 自动修复 → 流量热切换 → 快照告警",
      "D. 流量热切换 → 快照告警 → 自动修复",
    ],
    correctIndex: 0,
    explanation:
      "正确顺序：① 流量热切换（止血）→ ② 自动修复（治病）→ ③ 快照+告警（叫医生）。口诀：止血→治病→叫医生。",
    hint: "想想优先级：先保命还是先修bug？",
  },
  {
    project: "项目1：健康检查与自愈",
    type: "multi",
    question: "自愈策略第1步（流量热切换）的目标是什么？",
    options: [
      "A. 修复模型根因",
      "B. 保证服务可用性，防止劣化模型继续影响用户",
      "C. 通知运维团队",
      "D. 记录事件日志",
    ],
    correctIndex: 1,
    explanation: "流量热切换的目标是保证服务可用性，将流量从问题模型切到稳定版本，快速止血。",
    hint: "第一步永远是最紧急的事",
  },
  {
    project: "项目1：健康检查与自愈",
    type: "essay",
    question: '请默写自愈策略的3个步骤及每个步骤的目标。（写完后点"查看参考答案"对照）',
    hint: "口诀：止血→治病→叫医生",
    reference: [
      "步骤1：流量热切换 — 将生产流量切到上一个稳定版本模型。目标：保证服务可用性，止血。",
      "步骤2：自动修复 — 收集近30分钟数据，增量训练/校准，预发布验证。目标：修复根本原因。",
      "步骤3：快照+告警+暂停回切 — 记录事件快照，高优告警给团队，暂停自动回切。目标：人工兜底，防止自动流程误判或无限循环。",
    ],
  },

  // ===== 项目2: 数据清洗 =====
  {
    project: "项目2：数据清洗",
    type: "multi",
    question: "某重要字段空值率80%，正确的处理方式是？",
    options: [
      "A. 直接删除该字段",
      "B. 删除所有含空值的行",
      'C. 先分析空值与标签关联性，有规律则填充规范值，无规律则保留字段+新增"是否空"辅助特征',
      "D. 用0填充所有空值",
    ],
    correctIndex: 2,
    explanation:
      '不删字段！先分析空值与标签的关联规律：有规律→填充规范值（如"无"）；无规律→保留字段+新增辅助特征列。空值本身是有效特征信号。',
    hint: "高空值字段往往有隐藏信息",
  },
  {
    project: "项目2：数据清洗",
    type: "multi",
    question: "两条完全一致的对话文本有不同意图标注，正确的处理是？",
    options: [
      "A. 强制统一为出现次数最多的标注",
      "B. 删除这两条数据",
      "C. 抽样复核区分标注错误与多义性，错误则修正，歧义则保留多标签并标记争议样本",
      "D. 随机选一个标注",
    ],
    correctIndex: 2,
    explanation:
      '先抽样复核：标注错误→多数投票/专家审核修正；真实歧义→保留多标签+元数据标记"争议样本"。强行统一会抹杀语言多义性。',
    hint: "同样的文字可能有不同的意思",
  },
  {
    project: "项目2：数据清洗",
    type: "multi",
    question: "乱码字符的正确处理策略是？",
    options: [
      "A. 全部删除含乱码的数据",
      "B. 先尝试多编码修复(UTF-8/GBK/GB18030)，单字符删除，连续3个以上整条删除",
      "C. 不做处理直接使用",
      "D. 用空格替换所有乱码字符",
    ],
    correctIndex: 1,
    explanation:
      "先尝试多编码修复（UTF-8、GBK、GB18030）→ 单个乱码直接删除字符 → 连续3个以上乱码则整条删除/标记废弃。",
    hint: "少量乱码和大面积乱码处理方式不同",
  },
  {
    project: "项目2：数据清洗",
    type: "fill",
    context: "数据清洗培训要点：去重操作必须在什么完成之后进行？",
    codeLines: ["去重操作必须在_______完成后进行"],
    blanks: [
      {
        index: 0,
        answer: ["文本规范化", "规范化", "文本标准化"],
        hint: "格式不统一会导致去重不彻底，所以要先统一格式",
      },
    ],
    explanation: "文本规范化。因为格式不统一（如全角半角、空格差异）会导致去重不彻底。",
  },
  {
    project: "项目2：数据清洗",
    type: "multi",
    question: "以下哪项不是数据清洗培训要点？",
    options: [
      "A. 清洗前必须完整备份",
      "B. 严格执行日志记录制度",
      "C. 空值数据应优先删除",
      "D. 清洗后需对比前后数据分布",
    ],
    correctIndex: 2,
    explanation: "C是错的！禁止盲目删除空值数据，必须先分析空值分布规律和关联性再定方案。",
    hint: "想想空值能不能随便删",
  },
  {
    project: "项目2：数据清洗",
    type: "essay",
    question: "请写出数据清洗培训的5个核心要点。（写完后对照）",
    hint: "关键词：备份、日志、空值、去重时机、前后对比",
    reference: [
      "1. 备份：清洗前完整备份，操作可追溯可还原。",
      "2. 日志：每步操作记录修改量、删除量、异常量。",
      "3. 禁盲目删空值：先分析分布规律和关联性，再定方案。",
      "4. 去重时机：去重必须在文本规范化之后（否则去重不彻底）。",
      "5. 前后对比：清洗后对比数据分布，防止清洗过度导致样本偏移。",
    ],
  },
  {
    project: "项目2：数据清洗",
    type: "multi",
    question: "高空值字段不直接删除的核心原因是？",
    options: [
      "A. 删除会减少数据量",
      "B. 空值本身可作为模型学习的有效特征信号，直接删除会造成信息损失",
      "C. 删除操作太复杂",
      "D. 空值字段不影响模型",
    ],
    correctIndex: 1,
    explanation:
      "高空值字段往往具备隐藏数据特征，空值本身可作为模型学习的有效特征信号，直接删除会造成大量信息损失。",
    hint: "空值也是一种信息",
  },

  // ===== 项目3: 标注质检 =====
  {
    project: "项目3：标注质检",
    type: "codeblock",
    title: "代码填空：label_quality_checker.py",
    fileName: "label_quality_checker.py",
    codeLines: [
      "import numpy as np",
      "import pandas as pd",
      "from sklearn.ensemble import RandomForestClassifier",
      "",
      "# ========== 配置 ==========",
      "CONFIDENCE_THRESHOLD = 0.7    # 置信度低于此值的样本标记为疑似错误",
      'LABEL_FILE = "labels.csv"     # 标注结果文件（含 image_id, 50 个特征, label, annotator_id）',
      "",
      "def train_model(X, y):",
      '    """训练随机森林分类器"""',
      "    model = RandomForestClassifier(n_estimators=100)",
      "    # 填空1：训练模型的方法名",
      "    model.____(X, y)",
      "    return model",
      "",
      "def predict_confidence(model, X):",
      '    """',
      "    对每个样本预测类别和置信度",
      '    置信度 = 模型对该预测的最高概率值',
      '    """',
      "    proba = model.predict_proba(X)  # 获取每个类别的概率",
      "    # 填空2：预测类别的方法名",
      "    pred = model.____(X)",
      "    # 填空3：取最高概率的函数名",
      "    confidence = np.____(proba, axis=1)",
      "    return pred, confidence",
      "",
      "def detect_mislabeled(y_true, y_pred, confidence):",
      '    """',
      "    找出疑似错误标注的样本",
      '    判断规则：预测类别与标注类别不一致，且置信度低于阈值',
      '    """',
      "    inconsistent = (y_true != y_pred)",
      "    # 填空4：比较运算符",
      "    low_conf = confidence ____ CONFIDENCE_THRESHOLD",
      "    mislabeled_idx = np.where(inconsistent & low_conf)[0]",
      "    return mislabeled_idx",
      "",
      "def annotator_report(df, mislabeled_idx):",
      '    """生成标注员质量报告"""',
      '    df["is_mislabeled"] = False',
      '    df.loc[mislabeled_idx, "is_mislabeled"] = True',
      "",
      '    report = df.groupby("annotator_id").agg(',
      '        总标注数=("image_id", "count"),',
      '        疑似错误数=("is_mislabeled", "sum")',
      "    )",
      "    # 填空5：错误率的运算符（疑似错误数 ? 总标注数）",
      '    report["错误率"] = report["疑似错误数"] ____ report["总标注数"]',
      "    return report",
      "",
      "def main():",
      "    # 加载数据",
      "    df = pd.read_csv(LABEL_FILE)",
      "    # 特征列：f1 到 f50（图片经过预训练模型提取的特征向量）",
      '    X = df[[f"f{i}" for i in range(1, 51)]].values',
      '    y = df["label"].values',
      "",
      "    # 训练模型",
      "    model = train_model(X, y)",
      "",
      "    # 预测与质检",
      "    y_pred, confidence = predict_confidence(model, X)",
      "    mislabeled_idx = detect_mislabeled(y, y_pred, confidence)",
      "",
      "    # 生成报告",
      "    report = annotator_report(df, mislabeled_idx)",
      '    report.to_csv("quality_report.csv")',
      "",
      '    print(f"共发现 {len(mislabeled_idx)} 个疑似错误标注")',
      '    print("质检报告已保存为 quality_report.csv")',
      "",
      'if __name__ == "__main__":',
      "    main()",
    ],
    blanks: [
      { answer: ["fit"], hint: "sklearn 模型用什么方法训练？" },
      { answer: ["predict"], hint: "predict_proba 返回概率，用什么方法返回类别？" },
      { answer: ["max"], hint: "用 numpy 的什么方法取每行的最大值？" },
      { answer: ["<"], hint: "置信度低于阈值，用什么比较运算符？" },
      { answer: ["/"], hint: "错误率 = 错误数 ÷ 总数，用什么运算符？" },
    ],
    explanations: [
      "fit。model.fit(X, y) 是 sklearn 模型的标准训练方法。",
      "predict。model.predict(X) 返回预测类别，predict_proba 返回各类概率。",
      "max。np.max(proba, axis=1) 沿 axis=1 取每行最大概率值作为置信度。",
      "<。confidence < CONFIDENCE_THRESHOLD，低于0.7阈值的标记为低置信度。",
      '/。report["疑似错误数"] / report["总标注数"]，错误率 = 错误数 ÷ 总数。',
    ],
  },
  {
    project: "项目3：标注质检",
    type: "multi",
    question: "预测与标注不一致 + 置信度高达0.96，更可能是？",
    options: ["A. 标注错误", "B. 模型错误", "C. 图片模糊难判"],
    correctIndex: 1,
    explanation:
      "选B模型错误。模型96%确信 → 充分学习了特征分布 → 大概率是人工标注失误。如果图片模糊，模型置信度会很低，不可能到0.96。",
    hint: "高置信度说明模型很\"确信\"，这时候谁更可能出错？",
  },
  {
    project: "项目3：标注质检",
    type: "multi",
    question: "质检逻辑中判断疑似错误的条件组合是？",
    options: [
      "A. 预测与标注不一致 OR 置信度低于0.7",
      "B. 预测与标注不一致 AND 置信度低于0.7",
      "C. 置信度高于0.7 AND 预测正确",
      "D. 预测与标注一致 AND 置信度低于0.7",
    ],
    correctIndex: 1,
    explanation:
      '判断规则是"预测与标注不一致，且（AND）置信度低于0.7阈值"，两个条件同时满足才标记为疑似错误。',
    hint: "两个条件要同时满足还是只要一个？",
  },
  {
    project: "项目3：标注质检",
    type: "essay",
    question:
      "高置信度(0.96)预测与标注不一致时，为什么选B模型错误而不选A标注错误？请简述理由。",
    hint: "想想质检的判定逻辑适用范围",
    reference: [
      "1. 模型96%确信 → 充分学习了特征分布 → 大概率是人工标注失误",
      "2. 如果图片模糊 → 模型无法精准提取特征 → 置信度会显著偏低，不可能到0.96",
      '3. 质检逻辑是"低置信度+不一致=标注错误"，高置信度下不适用该判定逻辑 → 排除A、C',
    ],
  },

  // ===== 项目4: 自动驾驶 =====
  {
    project: "项目4：自动驾驶",
    type: "fill",
    context: "置信融合权重公式中，视觉的权重是？",
    codeLines: [
      "置信融合权重 = ____ × Conf_camera + 0.4 × σ_IMU",
    ],
    blanks: [
      {
        index: 0,
        answer: ["0.6"],
        hint: "视觉权重更大，和0.4加起来等于1",
      },
    ],
    explanation: "0.6。视觉置信度权重0.6，IMU方差权重0.4。摄像头不行时靠IMU稳住。",
  },
  {
    project: "项目4：自动驾驶",
    type: "fill",
    context: "补偿方案中减去的是什么？",
    codeLines: ["横向位置_补偿 = 横向位置_GPS - ____"],
    blanks: [
      {
        index: 0,
        answer: ["横向位置_历史均值", "历史均值", "横向位置的历史均值"],
        hint: "过去2秒的什么？",
      },
    ],
    explanation:
      "横向位置_历史均值（过去2秒）。通过减去短时历史均值，滤除强侧风带来的低频漂移。",
  },
  {
    project: "项目4：自动驾驶",
    type: "multi",
    question: "二级冗余策略中，哪一级最难实现？",
    options: [
      "A. 一级冗余（纯IMU航迹推算）",
      "B. 二级冗余（降级为车道偏离预警）",
      "C. 两者难度相当",
    ],
    correctIndex: 0,
    explanation:
      "一级冗余（纯IMU航迹推算）最难。原因：① 积分漂移（2-3秒偏差可超1米）② 缺绝对参考只能盲推 ③ 弯道误差放大 ④ 工程验证困难。",
    hint: "纯靠惯性导航没有外部参考会怎样？",
  },
  {
    project: "项目4：自动驾驶",
    type: "multi",
    question: "IMU一级冗余难实现的核心原因不包括？",
    options: [
      "A. 积分漂移问题",
      "B. 缺少绝对参考",
      "C. 传感器成本太高",
      "D. 弯道误差放大",
    ],
    correctIndex: 2,
    explanation:
      "核心原因包括：积分漂移、缺绝对参考、弯道误差放大、工程验证困难。传感器成本不是主要难点。",
    hint: "想想技术难点 vs 成本问题",
  },
  {
    project: "项目4：自动驾驶",
    type: "multi",
    question: "系统优化目标中，横向震荡频次应降至多少？",
    options: [
      "A. ≤15次/小时",
      "B. ≤10次/小时",
      "C. ≤3次/小时",
      "D. ≤1次/小时",
    ],
    correctIndex: 2,
    explanation:
      "横向震荡频次目标≤3次/小时（当前15次/小时）。弯道跟踪误差≤10cm，感知置信度≥0.7。",
    hint: "当前是15次，目标是原来的几分之一？",
  },
];
