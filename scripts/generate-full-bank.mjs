import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stages = [
  { id: "beginner", file: "01-beginner.json", prefix: "J01" },
  { id: "foundation", file: "02-foundation.json", prefix: "J02" },
  { id: "advanced", file: "03-advanced.json", prefix: "J03" },
  { id: "internals", file: "04-internals.json", prefix: "J04" },
  { id: "comprehensive", file: "05-comprehensive.json", prefix: "J05" },
];

const additions = Object.fromEntries(stages.map((stage) => [stage.id, []]));

function pack(stage, chapter, point, questions) {
  const difficulty = stage === "beginner" ? "基础" : stage === "comprehensive" || stage === "internals" ? "综合" : "巩固";
  const selected = [...questions];
  if (stage === "advanced") {
    const finalTrace = selected.findLast((question) => question.type === "output");
    selected.splice(selected.indexOf(finalTrace), 1);
  }
  for (const question of selected) additions[stage].push({ ...question, chapter, point, difficulty });
}

function choice(type, stem, options, reasoning, pitfall, takeaway) {
  const correctCount = options.filter((option) => option.correct).length;
  if ((type === "single" && correctCount !== 1) || (type === "multiple" && correctCount < 2)) {
    throw new Error(`${stem}: 选择题正确选项数量不符合题型`);
  }
  const builtOptions = options.map((option, index) => ({ id: String.fromCharCode(65 + index), text: option.text }));
  const answerIds = options.flatMap((option, index) => option.correct ? [builtOptions[index].id] : []);
  return {
    type,
    stem,
    options: builtOptions,
    answer: type === "single" ? answerIds[0] : answerIds,
    explanation: {
      reasoning,
      optionAnalysis: Object.fromEntries(options.map((option, index) => [builtOptions[index].id, option.why])),
      pitfall,
      takeaway,
    },
  };
}

function output(stem, code, answer, reasoning, pitfall, takeaway) {
  return { type: "output", difficulty: "巩固", stem, code, languageVersion: 21, answer, explanation: { reasoning, pitfall, takeaway } };
}

function debug(stem, code, answer, reasoning, pitfall, takeaway) {
  return { type: "debug", difficulty: "巩固", stem, code, languageVersion: 21, answer, explanation: { reasoning, pitfall, takeaway } };
}

function add(stage, chapter, point, questions) {
  pack(stage, chapter, point, questions);
}

// Each pack contributes two single-choice, two multiple-choice, three tracing,
// and two debugging questions. Every prompt and code sample is authored here.

add("beginner", "变量与类型", "数值类型与转换", [
  choice("single", "关于 Java 的基本整数类型，哪项说法正确？", [
    { text: "byte 的取值范围是 -128 到 127。", correct: true, why: "byte 使用 8 位有符号表示，范围为 -128 到 127。" },
    { text: "short 与 int 占用的位数相同。", correct: false, why: "short 为 16 位，int 为 32 位。" },
    { text: "long 字面量默认不需要后缀 L。", correct: false, why: "整数字面量默认按 int 处理，超出范围或希望按 long 运算时应写 L。" },
    { text: "char 是带符号的 16 位整数。", correct: false, why: "char 是 16 位无符号 UTF-16 代码单元。" },
  ], "byte 是 8 位有符号整数，最大值为 127。", "不要把每种类型的位数和范围混为一谈。", "记住基本整数类型的宽度：byte 8、short 16、int 32、long 64。"),
  choice("single", "执行 `double x = 5 / 2;` 后，x 的值是什么？", [
    { text: "2.0", correct: true, why: "5 和 2 都是 int，除法先得到 2，再将结果扩大为 double。" },
    { text: "2.5", correct: false, why: "赋值目标类型不会让已经执行的整数除法改成浮点除法。" },
    { text: "2", correct: false, why: "变量的存储类型是 double，输出或读取时会表现为 2.0。" },
    { text: "编译失败", correct: false, why: "int 可以自动扩大转换为 double。" },
  ], "先以 int 执行 `5 / 2` 得到 2，再扩大转换为 2.0。", "浮点变量不会反向改变右侧表达式的运算类型。", "想得到 2.5，应写 `5.0 / 2` 或进行显式转换。"),
  choice("multiple", "以下哪些赋值不需要显式窄化转换？", [
    { text: "`long n = 12;`", correct: true, why: "int 到 long 是安全的扩大转换。" },
    { text: "`double d = 3.5f;`", correct: true, why: "float 到 double 是扩大浮点转换。" },
    { text: "`int n = 12L;`", correct: false, why: "long 到 int 可能丢失高位，需要显式转换。" },
    { text: "`byte b = 128;`", correct: false, why: "128 超出 byte 范围，常量也无法通过赋值范围检查。" },
  ], "int 可以扩大为 long，float 可以扩大为 double；反方向转换可能损失信息。", "字面量后缀会改变其类型，进而影响是否能赋值。", "先判定表达式的静态类型，再判断转换方向与取值范围。"),
  choice("multiple", "以下关于 `char` 与数值运算的说法哪些正确？", [
    { text: "`'A' + 1` 的表达式类型是 int。", correct: true, why: "char 参与二元算术前会进行一元数值提升。" },
    { text: "`char` 可以保存 `\u4e2d` 这样的 UTF-16 代码单元。", correct: true, why: "char 的范围覆盖 0 到 65535，包含该代码单元。" },
    { text: "`char` 可以直接保存任意 Unicode 码点。", correct: false, why: "补充平面字符需要一对 UTF-16 代码单元，单个 char 不能容纳。" },
    { text: "`'A' + 1` 的结果仍然是 char。", correct: false, why: "运算时提升为 int，结果类型为 int。" },
  ], "char 是 UTF-16 代码单元；参加算术运算时会提升为 int。", "代码单元与 Unicode 码点不是同一个概念。", "处理完整 Unicode 文本时，使用 `String` 或码点 API。"),
  output("程序将输出什么？", "long n = 3_000_000_000L;\nSystem.out.println(n / 2);", "1500000000", "L 后缀使字面量为 long，因此除法按 long 运算，结果为 1500000000。", "不要遗漏超出 int 范围的字面量后缀。", "数字分隔符不改变数值，只提升可读性。"),
  output("两行输出依次是什么？", "System.out.println(9 / 4);\nSystem.out.println(9 % 4);", "2\n1", "整数除法取商 2，余数运算得到 1，并满足 9 = 2 × 4 + 1。", "`/` 与 `%` 是两个不同运算符。", "用商和余数可以拆分整数单位。"),
  output("下面代码输出什么？", "char letter = 'A';\nSystem.out.println(letter + 2);", "67", "`letter` 以数值 65 参与 int 运算，结果是 67。", "字符参与算术后，结果通常不再是 char。", "需要字符时，可显式转换并确认结果仍在 char 范围内。"),
  debug("这段代码无法编译，应该怎样改？", "int count = 4_000_000_000;\nSystem.out.println(count);", "将 count 声明为 long，并把字面量写为 4_000_000_000L。", "该整数字面量超过 int 上限；应让字面量和接收变量都使用 long。", "只改变量声明仍不够，字面量本身也必须能被解析为 long。", "处理大整数时，从字面量开始检查类型。"),
  debug("如何保留 7 除以 2 的小数部分？", "double quotient = 7 / 2;\nSystem.out.println(quotient);", "改为 `double quotient = 7.0 / 2;`，或先把至少一个操作数转换为 double。", "原表达式先进行 int 除法，得到 3，再赋值为 3.0。", "把结果变量改为 double 不会改变已发生的整数除法。", "至少一个操作数必须是浮点类型。"),
]);

add("beginner", "运算符", "优先级与短路求值", [
  choice("single", "表达式 `true || check()` 中，`check()` 会执行吗？", [
    { text: "不会，|| 左侧为 true 时会短路。", correct: true, why: "逻辑或左侧已经为 true，右侧不影响结果，因此不再求值。" },
    { text: "会，|| 总会计算两侧。", correct: false, why: "总是计算两侧的是按位或 `|`，不是短路逻辑或 `||`。" },
    { text: "只有 check 返回 false 才会执行。", correct: false, why: "右侧未执行时，不存在返回值。" },
    { text: "代码无法编译。", correct: false, why: "只要 check 返回 boolean，该表达式就合法。" },
  ], "`||` 的左侧已为 true，结果必为 true，右侧会跳过。", "单个 `|` 和双竖线 `||` 的求值行为不同。", "短路运算可用于安全地延后右侧判断。"),
  choice("single", "表达式 `2 + 3 * 4` 的值是多少？", [
    { text: "14", correct: true, why: "乘法优先于加法，先算 3 × 4，再加 2。" },
    { text: "20", correct: false, why: "从左到右直接计算会忽略运算符优先级。" },
    { text: "24", correct: false, why: "加法也参与表达式，不能只计算乘法部分。" },
    { text: "语法错误", correct: false, why: "该算术表达式语法有效。" },
  ], "乘法优先级高于加法：2 + (3 × 4) = 14。", "不要仅按书写顺序从左向右计算不同优先级的运算符。", "复杂表达式可以增加括号表达预期分组。"),
  choice("multiple", "以下哪些表达式会发生短路？", [
    { text: "`false && check()`", correct: true, why: "&& 左侧为 false，结果已确定。" },
    { text: "`true || check()`", correct: true, why: "|| 左侧为 true，结果已确定。" },
    { text: "`false & check()`", correct: false, why: "boolean 的单个 `&` 会计算左右两侧。" },
    { text: "`true | check()`", correct: false, why: "boolean 的单个 `|` 不会短路。" },
  ], "逻辑 `&&` 与 `||` 会依据左侧值省略无需执行的右侧。", "按位 `&`、`|` 用于 boolean 时仍会计算两边。", "当右侧含副作用或可能空指针时，短路顺序很重要。"),
  choice("multiple", "以下哪些结果为 true？", [
    { text: "`!false`", correct: true, why: "逻辑非将 false 取反为 true。" },
    { text: "`3 > 2 && 1 == 1`", correct: true, why: "两个比较都为 true，逻辑与结果为 true。" },
    { text: "`2 < 1 || 4 < 3`", correct: false, why: "两个条件都为 false，逻辑或为 false。" },
    { text: "`!(2 == 2)`", correct: false, why: "括号中相等比较为 true，取反后为 false。" },
  ], "前两项分别是逻辑非 true，以及两个 true 条件的逻辑与。", "`!` 会反转括号中完整表达式的布尔结果。", "可把较复杂布尔式分成子条件逐一求值。"),
  output("最后输出多少？", "int x = 5;\nSystem.out.println(x++ + ++x);", "12", "后置自增先取 5 再变 6；前置自增变为 7 并取 7，和为 12。", "同一表达式中连续修改变量容易造成阅读错误。", "理解前后置语义后，实际代码优先拆成多行。"),
  output("程序输出什么？", "int x = 1;\nboolean result = x++ > 1 && ++x > 1;\nSystem.out.println(x + \":\" + result);", "2:false", "左侧比较使用旧值 1，随后 x 变为 2；条件为 false 使 && 短路，所以右侧不执行。", "短路会阻止右侧的自增副作用。", "先计算左操作数及其副作用，再决定是否计算右侧。"),
  output("输出的布尔值是什么？", "int a = 2;\nSystem.out.println(a > 1 || ++a > 2);\nSystem.out.println(a);", "true\n2", "第一个比较为 true，|| 跳过右侧；a 保持 2。", "不要假定逻辑运算一定会执行全部操作数。", "用副作用追踪题检查短路分支。"),
  debug("下面的判断可能因空引用抛出异常，怎样安全地改写？", "if (name.length() > 0 && name != null) {\n    System.out.println(name);\n}", "把 `name != null` 移到 `name.length()` 前面：`name != null && name.length() > 0`。", "左侧会先执行，name 为空时访问 length 会抛 NullPointerException。", "`&&` 的求值顺序固定为从左到右。", "将空值守卫放在可能解引用的表达式之前。"),
  debug("这段布尔判断为什么没有短路保护？如何避免每次都调用 expensiveCheck？", "boolean valid = input != null & expensiveCheck(input);", "使用 `&&`：`boolean valid = input != null && expensiveCheck(input);`。", "单个 `&` 对 boolean 运算不会短路，右侧始终执行。", "`&` 有位运算和逻辑非短路用途，不能当作 `&&` 的拼写变体。", "控制流程需要短路时，使用 `&&` 或 `||`。"),
]);

function quiz(type, stem, texts, correctIndexes, reasoning, pitfall, takeaway) {
  const options = texts.map((text, index) => ({ id: String.fromCharCode(65 + index), text }));
  const ids = correctIndexes.map((index) => options[index].id);
  return {
    type, stem, options, answer: type === "single" ? ids[0] : ids,
    explanation: { reasoning, pitfall, takeaway },
  };
}

add("beginner", "流程控制", "条件分支与循环边界", [
  quiz("single", "`do...while` 与 `while` 的关键区别是什么？", ["do...while 至少执行一次循环体。", "do...while 不能使用 boolean 条件。", "while 一定比 do...while 多执行一次。", "两者只能遍历数组。"], [0], "do...while 在循环体之后检查条件，所以第一次执行不受条件真假影响。", "while 与 do...while 的判断位置不同。", "需要先执行一次再决定是否重复时使用 do...while。"),
  quiz("single", "没有 `break` 的传统 switch 中，匹配分支结束后通常会怎样？", ["继续执行后续分支语句，直到遇到 break 或 switch 结束。", "自动跳到 switch 末尾。", "重新判断下一个 case。", "编译器总会插入 break。"], [0], "传统冒号 case 在匹配后会发生贯穿执行（fall-through）。", "不要把传统 switch 和使用箭头标签的 switch 写法混为一谈。", "在传统 case 中明确写 break，或使用无贯穿的箭头标签。"),
  quiz("multiple", "以下哪些写法可用于退出循环？", ["在循环体中执行 `break;`。", "循环条件变为 false 后自然结束。", "执行 `continue;` 立即退出整个循环。", "`return;` 总是只结束当前一轮循环。"], [0, 1], "break 直接结束当前循环；条件不成立时循环也会自然结束。", "continue 结束当前轮并进入下一轮，不会退出循环。", "区分 break、continue 与 return 各自控制的范围。"),
  quiz("multiple", "以下关于 `for` 循环的说法哪些正确？", ["初始化表达式通常执行一次。", "每轮循环体后会执行更新表达式，再检查条件。", "条件省略时等价于条件为 false。", "continue 会跳过本轮的更新表达式。"], [0, 1], "普通 for 循环先初始化，然后反复检查条件、执行循环体和更新表达式。", "continue 在 for 循环中仍会进入更新步骤。", "画出初始化、条件、循环体、更新的执行顺序。"),
  output("循环完成后输出什么？", "int i = 0;\nwhile (i < 3) {\n    i++;\n}\nSystem.out.println(i);", "3", "i 依次变为 1、2、3；当 i 等于 3 时条件为 false。", "条件是 `< 3`，所以值为 3 时不会再进入循环。", "退出循环时变量可能已经等于边界值。"),
  output("程序输出什么？", "int sum = 0;\nfor (int i = 1; i <= 4; i += 2) sum += i;\nSystem.out.println(sum);", "4", "i 依次为 1 和 3，sum 最终为 1 + 3 = 4。", "更新表达式每轮增加 2，不是增加 1。", "列出每轮循环变量，比只看边界更可靠。"),
  output("下面代码输出什么？", "int n = 5;\ndo { n -= 2; } while (n > 10);\nSystem.out.println(n);", "3", "do...while 先执行一次循环体，n 从 5 变为 3，之后条件为 false。", "即使首轮条件最终为 false，do...while 也已执行。", "判断循环类型时先找到条件检查发生的位置。"),
  debug("这个循环在什么条件下会永久执行？请给出一种修复。", "int i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n}", "在循环体中增加 `i++`，使 i 最终达到 5 并让条件为 false。", "循环体没有修改 i，条件一直为 true。", "循环变量必须沿着能够终止循环的方向更新。", "检查循环体是否会改变条件所依赖的状态。"),
  debug("如何让这个 switch 只打印一个匹配结果？", "switch (code) {\n    case 1: System.out.println(\"one\");\n    case 2: System.out.println(\"two\");\n    default: System.out.println(\"other\");\n}", "在各个传统 case 末尾添加 `break`，或将 case 改为箭头标签。", "传统 switch 匹配后会继续执行后续标签的语句。", "default 也会在发生贯穿时执行。", "为传统 case 写出清晰的结束方式，避免意外贯穿。"),
]);

add("beginner", "数组", "数组遍历与复制", [
  quiz("single", "`int[] a = new int[3];` 创建后，三个元素的初始值是什么？", ["都是 0。", "都是 null。", "没有初始值，读取时必然编译失败。", "第一个为 0，其余为 null。"], [0], "数组元素会获得其类型的默认值；int 元素默认为 0。", "局部变量必须显式初始化，数组元素则会自动初始化。", "区分局部变量和对象字段、数组元素的默认值规则。"),
  quiz("single", "数组长度为 5 时，最后一个合法下标是多少？", ["4", "5", "1", "由数组内容决定。"], [0], "数组下标从 0 开始，最后一个下标是 length - 1。", "length 表示元素个数，不表示最大下标。", "遍历条件通常写为 `i < array.length`。"),
  quiz("multiple", "以下哪些操作不会直接修改数组 `source` 的元素？", ["`int[] copy = source;` 后改 `copy[0]`。", "`int[] copy = source.clone();` 后改 `copy[0]`。", "把 `source[1]` 赋给一个 int 变量再修改该变量。", "调用 `Arrays.sort(source)`。"], [1, 2], "clone 会创建新数组；把 int 元素赋给局部变量则复制其数值。", "赋值数组引用只复制引用，并未复制底层数组。", "检查修改作用于引用、数组本身，还是元素值的副本。"),
  quiz("multiple", "关于增强 for 循环，哪些说法正确？", ["适合依次读取数组或 Iterable 中的元素。", "循环变量是数组下标。", "给循环变量重新赋值不会替换原集合中的元素。", "遍历时可以安全地删除当前 ArrayList 元素而不影响迭代。"], [0, 2], "增强 for 把当前元素值或引用赋给循环变量；变量不是下标。", "对 ArrayList 做结构性修改仍可能触发迭代器的并发修改检测。", "需要下标时用传统 for；需要安全删除时使用 Iterator.remove。"),
  output("输出什么？", "int[] values = {2, 4, 6};\nvalues[1] = values[0] + values[2];\nSystem.out.println(values[1]);", "8", "索引 1 被赋值为索引 0 与索引 2 的和，即 2 + 6。", "数组赋值会更新指定元素，不会自动重排其他元素。", "先用花括号列出下标和值，有助于跟踪数组变化。"),
  output("程序会输出什么？", "int[] a = {3, 1};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);", "9", "a 和 b 保存同一个数组对象的引用，修改 b[0] 也能通过 a 观察到。", "数组变量存储的是引用，不是数组元素的副本。", "需要独立数组时调用 clone 或复制工具。"),
  output("打印的行数是多少？", "String[] names = {\"A\", \"B\", \"C\"};\nint count = 0;\nfor (String name : names) count++;\nSystem.out.println(count);", "3", "增强 for 对三个数组元素各执行一次循环体。", "循环变量 name 并不是数组下标。", "用增强 for 遍历时，迭代次数等于元素数。"),
  debug("下面的复制结果仍会随原数组变化，怎样获得独立副本？", "int[] source = {2, 4, 6};\nint[] copy = source;", "使用 `int[] copy = source.clone();`，或使用 `Arrays.copyOf(source, source.length)`。", "数组赋值只复制引用，因此 source 与 copy 指向同一数组。", "新变量名并不意味着新数组对象。", "区分浅拷贝数组引用和新建数组。"),
  debug("为什么这段循环会越界？正确的边界条件是什么？", "int[] values = {7, 8, 9};\nfor (int i = 0; i <= values.length; i++) {\n    System.out.println(values[i]);\n}", "把条件改成 `i < values.length`；有效下标为 0、1、2。", "`<=` 让 i 取到 3，访问 values[3] 时越界。", "空数组长度为 0，`i < length` 也能自然跳过循环。", "数组循环上界是 length（不包含），不是 length - 1（包含）。"),
]);

add("beginner", "方法", "参数传递与返回值", [
  quiz("single", "Java 调用 `change(n)`，方法内将 int 形参改为 9 后，调用方 n 会怎样？", ["保持原值，因为传入的是 n 的值的副本。", "自动变为 9，因为参数按引用传递。", "变为 0，因为方法局部变量会清零。", "只有 n 是 final 时才保持原值。"], [0], "基本类型参数按值传递，方法得到的是调用方数值的副本。", "Java 中对象参数同样是值传递，只是复制的值可能是对象引用。", "区分修改形参变量和修改引用所指向对象的状态。"),
  quiz("single", "方法声明返回类型为 `void`，以下哪种写法符合它的用途？", ["可以执行 `return;` 结束方法，但不返回值。", "必须返回 null。", "必须返回 0。", "不能出现 return 语句。"], [0], "void 表示方法不向调用者提供返回值；return 可用于提前结束。", "void 不是一个需要返回的值类型。", "用 return 结束控制流，不要附带表达式。"),
  quiz("multiple", "以下关于方法重载的说法哪些正确？", ["同名方法可以通过不同参数列表构成重载。", "只改变返回类型不能构成重载。", "形参名不同就一定构成重载。", "调用时编译器根据实参选择适用的方法。"], [0, 1, 3], "重载由方法名与参数列表区分，调用解析会考虑实参和适用转换。", "返回类型和形参名称不属于区分重载的充分条件。", "检查参数个数、类型和顺序，而不是只比较名字。"),
  quiz("multiple", "下列哪些描述符合 Java 参数传递？", ["基本类型实参的值复制到形参。", "对象引用作为一个值复制到形参。", "方法给形参重新赋一个对象不会让调用方引用改指向。", "把对象传入方法后，方法永远不能修改对象状态。"], [0, 1, 2], "形参收到实参值的副本；对象状态仍可通过复制的引用修改。", "引用值的复制和对象本身的复制不是一回事。", "先问方法是重绑引用，还是修改共享对象。"),
  output("程序输出什么？", "static int twice(int x) { return x * 2; }\nint n = 4;\nSystem.out.println(twice(n));", "8", "方法得到 4，返回 4 × 2 的结果 8。", "return 的值由方法签名决定。", "调用方可以把表达式结果直接用于输出或赋值。"),
  output("执行后输出什么？", "static void reset(int value) { value = 0; }\nint score = 6;\nreset(score);\nSystem.out.println(score);", "6", "形参 value 是 score 当前值的副本，赋值不会改变 score。", "方法调用不会自动把参数中的新值写回调用方。", "需要更新调用方变量时，让方法返回新值并接收它。"),
  output("输出哪一个重载结果？", "static String pick(long n) { return \"long\"; }\nstatic String pick(double n) { return \"double\"; }\nSystem.out.println(pick(4));", "long", "int 实参可以扩大到 long 或 double，两者中 long 是更具体的适用选择。", "重载在编译期按静态类型与最适用转换解析。", "同时出现多个重载时，逐一比较方法调用转换。"),
  debug("为什么这段方法无法通过编译？如何让所有执行路径都有返回值？", "static int sign(int n) {\n    if (n >= 0) return 1;\n}", "为 n < 0 的路径补上返回值，例如在 if 之后写 `return -1;`。", "返回类型为 int 的方法必须保证每条可能路径都返回 int。", "局部看来常见的输入不等于编译器可证明的所有路径。", "逐条检查条件分支是否覆盖全部执行路径。"),
  debug("如何让 `add(1, 2)` 仍可编译，并让 `add(1, 2, 3)` 求和？", "static int add(int a, int b) {\n    return a + b;\n}", "增加 `static int add(int a, int b, int c)` 重载，或将方法改为接收 `int... values` 并遍历求和。", "现有签名只接受两个 int 实参。", "变参在调用点可接收零个或多个同类型实参，但仍需定义如何汇总。", "按不同参数列表重载，或用变参表达数量可变的输入。"),
]);

add("beginner", "字符串", "字符串基础与作用域", [
  quiz("single", "Java `String` 对象的典型特性是什么？", ["不可变：拼接会得到新字符串。", "可变：每次调用 concat 都改写原对象。", "只能保存 ASCII 字符。", "不能用 `equals` 比较内容。"], [0], "String 不可变，字符串内容变化会产生另一个 String 值。", "引用变量可重新赋值，但这不等于原 String 对象被改写。", "大量循环拼接可考虑 StringBuilder。"),
  quiz("single", "两个字符串内容比较应优先使用什么？", ["`a.equals(b)`。", "`a == b`。", "`a.compareTo(b) == 1`。", "比较两个对象的 hashCode。"], [0], "equals 用于比较字符串内容；== 判断是否为同一对象引用。", "字符串常量池可能让部分相同字面量引用相同对象，不能据此依赖 == 比较内容。", "比较前还应处理可能为 null 的接收者。"),
  quiz("multiple", "关于字符串拼接，哪些说法正确？", ["`StringBuilder.append` 会修改 builder 并返回 builder。", "`String` 拼接表达式会产生字符串结果。", "`String` 的 `concat` 会原地改变接收者。", "在循环里反复拼接大量字符串可能产生额外对象。"], [0, 1, 3], "StringBuilder 适合可变式追加；String 表达式得到新字符串结果。", "不可变性意味着 concat 不会改变原字符串。", "小规模拼接可直接使用 +；大量迭代拼接时考虑 builder。"),
  quiz("multiple", "以下关于局部变量与字段的说法哪些正确？", ["局部变量使用前必须先明确赋值。", "对象的 int 字段默认值为 0。", "未赋值的局部 int 变量会自动设为 0。", "实例字段在对象构造时有默认值。"], [0, 1, 3], "字段在初始化阶段会得到默认值；局部变量必须先被赋值才能读取。", "字段默认值规则不适用于未初始化的局部变量。", "看到变量时先判断它是字段还是局部变量。"),
  output("输出什么？", "String word = \"java\";\nword.toUpperCase();\nSystem.out.println(word);", "java", "toUpperCase 返回新字符串，但结果未保存，因此 word 仍引用原值。", "String 的方法不会就地修改内容。", "接收并保存不可变对象方法返回的新值。"),
  output("下面输出什么？", "String a = new String(\"hi\");\nString b = new String(\"hi\");\nSystem.out.println((a == b) + \":\" + a.equals(b));", "false:true", "new 创建了两个不同对象，== 为 false；它们内容相同，equals 为 true。", "对象身份与对象内容是两个不同判断。", "引用身份比较用 ==，内容相等比较用 equals。"),
  output("拼接后的长度是多少？", "StringBuilder text = new StringBuilder(\"Java\");\ntext.append(\"21\");\nSystem.out.println(text.length());", "6", "builder 内容变为 Java21，共六个 UTF-16 代码单元。", "append 修改 StringBuilder 本身。", "StringBuilder 可在单线程局部拼接场景减少中间字符串。"),
  debug("下面的比较有时正确、有时错误，怎样按内容比较？", "if (left == right) {\n    System.out.println(\"same text\");\n}", "使用 `left != null && left.equals(right)`，或 `Objects.equals(left, right)` 处理 null。", "== 比较对象引用身份，不保证内容相同就返回 true。", "空引用调用 equals 会抛 NullPointerException。", "内容比较用 equals，并明确 null 策略。"),
  debug("为什么打印内容没有变成大写？怎样修正？", "String title = \"java\";\ntitle.toUpperCase();\nSystem.out.println(title);", "保存返回值：`title = title.toUpperCase();`。", "String 不可变，toUpperCase 返回新字符串而不修改 title 原引用的内容。", "忽略不可变对象方法的返回值会丢掉转换结果。", "对不可变值，转换操作的结果需要重新接收。"),
]);

add("foundation", "类与对象", "构造、字段与初始化", [
  quiz("single", "创建对象时，实例字段和构造器的初始化顺序通常是什么？", ["先执行字段初始化，再执行构造器主体。", "先执行构造器主体，再初始化字段。", "字段只会在第一次读取时初始化。", "每个构造器都从头重复整个父类初始化过程。"], [0], "构造对象时会先完成父类初始化，再按声明顺序初始化本类实例字段，随后执行构造器主体。", "字段初始化表达式也是构造过程的一部分。", "沿继承链逐层从父类到子类跟踪初始化顺序。"),
  quiz("single", "类中没有显式声明任何构造器时，Java 通常会做什么？", ["提供一个无参默认构造器。", "提供一个任意参数的构造器。", "禁止创建该类实例。", "把所有字段都设为 final。"], [0], "未声明构造器时，编译器会提供无参默认构造器。", "只要声明了任意构造器，编译器就不会再自动补无参版本。", "需要无参创建时，要确认类确实有可用的无参构造器。"),
  quiz("multiple", "关于构造器，哪些说法正确？", ["构造器没有返回类型。", "`this(...)` 可以调用同一类的另一个构造器。", "构造器可以声明 `static`。", "构造器中的 `this(...)` 必须是第一条语句。"], [0, 1, 3], "构造器以类名命名且不声明返回类型；this 调用可用于构造器串联，并必须位于首行。", "构造器用于实例初始化，不能声明为 static。", "检查显式构造器调用是否违反首语句限制。"),
  quiz("multiple", "以下哪些值可作为对象创建后的字段默认值？", ["int 字段默认为 0。", "boolean 字段默认为 false。", "对象引用字段默认为空引用 null。", "String 字段默认为空字符串。"], [0, 1, 2], "字段按类型获得默认值；引用类型默认是 null，String 不例外。", "null 与内容为空的 String 是两种不同状态。", "默认值不会替代业务上明确的初始化逻辑。"),
  output("构造后输出什么？", "class Box { int size = 3; Box() { size = size + 2; } }\nBox box = new Box();\nSystem.out.println(box.size);", "5", "字段先初始化为 3，构造器再将其加 2。", "字段初始化不会跳过构造器主体。", "按初始化顺序逐步更新字段值。"),
  output("两行输出是什么？", "class Counter { static int total; int value; Counter() { total++; value = total; } }\nCounter a = new Counter();\nCounter b = new Counter();\nSystem.out.println(a.value + \":\" + b.value);\nSystem.out.println(Counter.total);", "1:2\n2", "total 是所有对象共享的静态字段；两次构造分别令它变为 1 和 2。", "实例字段 value 则分别保存在不同对象中。", "区分 static 共享状态和实例状态。"),
  output("最终输出什么？", "class Label { String text = \"A\"; Label() { this(\"B\"); text += \"C\"; } Label(String value) { text = value; } }\nSystem.out.println(new Label().text);", "BC", "无参构造器先委托到带参构造器，将 text 设为 B；随后追加 C。", "this(...) 完成后，当前构造器还会继续执行后续语句。", "构造器链的调用顺序从被委托构造器返回后继续。"),
  debug("为什么这段类在没有无参构造器时创建失败？如何让两种创建方式都工作？", "class User { User(String name) {} }\nUser user = new User();", "为 User 添加无参构造器，或在创建处传入 String 参数；若都需要则两个构造器都声明。", "显式声明 User(String) 后，编译器不再自动生成无参构造器。", "默认构造器仅在完全没有声明构造器时出现。", "新增构造器后检查旧调用点的兼容性。"),
  debug("这里的字段与参数同名，怎样保证构造器能给字段赋值？", "class User {\n    String name;\n    User(String name) { name = name; }\n}", "写成 `this.name = name;`。", "未限定的 name 在构造器中指向参数，`name = name` 只给参数自身赋值。", "形参与字段同名时，作用域会遮蔽字段。", "使用 this 明确指向当前对象字段。"),
]);

add("foundation", "继承与多态", "重写与动态分派", [
  quiz("single", "父类引用指向子类对象，调用一个已重写的实例方法时，执行哪个实现？", ["运行时对象所属子类的重写实现。", "引用变量声明类型对应的父类实现。", "由变量名首字母决定。", "编译器随机选择一个实现。"], [0], "实例方法重写采用动态分派，执行版本由运行时对象类型决定。", "字段访问和静态方法隐藏遵循不同规则。", "把变量的静态类型与对象的实际类型分开分析。"),
  quiz("single", "子类重写父类方法时，访问权限可以怎样变化？", ["可以保持或放宽，不能变得更严格。", "只能变得更严格。", "必须改成 private。", "可以任意变化。"], [0], "重写方法不能缩小父类方法的可访问范围。", "返回类型和异常声明也受重写规则限制。", "使用 `@Override` 让编译器验证重写意图。"),
  quiz("multiple", "哪些说法符合方法重写规则？", ["子类实例方法可以重写可访问的父类实例方法。", "`final` 实例方法不能被子类重写。", "静态方法通过动态分派被重写。", "子类重写方法不能声明比父类更宽的受检异常。"], [0, 1, 3], "final 禁止继续重写；受检异常不能扩大父类方法承诺的范围。", "静态方法隐藏而非实例重写，不参与动态分派。", "使用 Override 注解并检查异常与访问权限。"),
  quiz("multiple", "以下关于多态的说法哪些正确？", ["父类引用可以指向其子类实例。", "编译期会检查引用静态类型是否声明了所调用方法。", "字段访问也会像实例方法一样动态分派。", "向下转型在实际对象不匹配时会抛 ClassCastException。"], [0, 1, 3], "引用静态类型决定编译期可见成员；实例方法的实现再由运行时类型决定。", "字段访问依据表达式的静态类型，不进行方法式动态分派。", "必要时使用 instanceof 模式匹配或显式类型检查。"),
  output("输出哪一个方法结果？", "class Parent { String name() { return \"P\"; } }\nclass Child extends Parent { @Override String name() { return \"C\"; } }\nParent item = new Child();\nSystem.out.println(item.name());", "C", "调用的是实例方法；运行时对象为 Child，因此执行重写实现。", "Parent 类型变量不意味着对象实际类型是 Parent。", "跟踪方法调用时关注对象运行时类型。"),
  output("打印结果是什么？", "class Parent { int value = 1; int get() { return value; } }\nclass Child extends Parent { int value = 2; @Override int get() { return value; } }\nParent p = new Child();\nSystem.out.println(p.value + p.get());", "3", "字段访问 `p.value` 按引用静态类型取父类字段 1；方法调用动态分派到子类返回 2。", "字段隐藏和方法重写是两种不同机制。", "同一表达式中分别判断字段访问与实例方法调用。"),
  output("程序最后输出什么？", "class A { static String kind() { return \"A\"; } }\nclass B extends A { static String kind() { return \"B\"; } }\nA ref = new B();\nSystem.out.println(ref.kind());", "A", "静态方法按引用表达式的编译期类型解析，`ref` 的声明类型是 A。", "不建议通过实例引用调用静态方法；直接写类名更清晰。", "static 方法会隐藏，不按运行时对象动态分派。"),
  debug("为什么不能用 `@Override` 标记这个方法？修正哪个签名？", "class Base { void save(Object value) {} }\nclass Child extends Base { @Override void save(String value) {} }", "若要重写，应改为 `void save(Object value)`；若保留 String 参数，它是重载，应移除 Override。", "参数列表不同，因此 save(String) 没有重写 save(Object)。", "返回类型相同也不能弥补参数签名不同。", "重写要求匹配方法签名，并可有合法协变返回类型。"),
  debug("为什么这个向下转型会在运行时失败？怎样安全调用子类方法？", "class Animal {}\nclass Cat extends Animal { void meow() {} }\nAnimal pet = new Animal();\n((Cat) pet).meow();", "先确认 `pet instanceof Cat` 后再转型，或将 pet 初始化为 Cat 对象。", "pet 实际指向 Animal 实例，不是 Cat 实例。", "编译器允许相关类之间显式向下转型，但无法保证运行时对象匹配。", "运行时类型检查可以避免不安全转型。"),
]);

add("foundation", "接口", "抽象契约与默认方法", [
  quiz("single", "接口中的普通实例方法默认具有什么访问级别？", ["public。", "private。", "protected。", "仅对同包可见。"], [0], "接口的普通抽象实例方法是 public；实现时不能降低可见性。", "private 接口方法是 Java 9 以后用于接口内部复用的另一种语法。", "实现接口方法时保留 public。"),
  quiz("single", "一个类实现接口时，对接口抽象方法通常需要做什么？", ["提供满足契约的 public 实现，或将类声明为 abstract。", "把方法改成 private。", "只需在构造器中调用一次。", "接口方法会自动变成字段。"], [0], "非抽象类必须实现全部继承的抽象方法。", "接口方法的公开契约不能通过较低权限实现。", "编译错误通常会指出尚未实现的方法。"),
  quiz("multiple", "关于接口的说法哪些正确？", ["一个类可以实现多个接口。", "接口可以声明 default 实例方法。", "接口字段默认是 public static final。", "接口可以直接 `new Interface()` 创建实例。"], [0, 1, 2], "接口支持多实现契约；字段是常量，default 方法提供默认实例行为。", "接口本身不能直接实例化。", "需要对象时创建实现类或使用匿名实现。"),
  quiz("multiple", "类实现的两个接口提供了同签名且互不相关的 default 方法，哪些做法有效？", ["实现类重写该方法以消除冲突。", "实现类可用 `InterfaceA.super.method()` 调用其中一个默认实现。", "编译器会随机选一个接口。", "把其中一个接口改成父类即可自动决定。"], [0, 1], "类必须显式解决两个互不相关 default 实现之间的冲突。", "实现时可以分别委托到明确的接口默认实现。", "冲突不能依赖声明顺序或编译器猜测。"),
  output("输出结果是什么？", "interface Greeter { default String greet() { return \"hello\"; } }\nclass Person implements Greeter {}\nSystem.out.println(new Person().greet());", "hello", "Person 没有重写 greet，因此使用接口提供的 default 实现。", "default 是实例方法，不是静态方法。", "默认方法帮助接口演进，同时仍可由实现类覆盖。"),
  output("程序会打印什么？", "interface A { default String name() { return \"A\"; } }\nclass B implements A { @Override public String name() { return A.super.name() + \"B\"; } }\nSystem.out.println(new B().name());", "AB", "B 的实现显式调用 A 的默认方法并追加 B。", "`A.super` 只能在合适的实现上下文中调用直接相关接口默认方法。", "接口默认方法可被组合复用，但冲突需要显式处理。"),
  output("这两个常量的值是什么？", "interface Limits { int MAX = 8; }\nSystem.out.println(Limits.MAX);", "8", "接口字段隐式为 public static final 常量，可通过接口名访问。", "接口字段不是每个实现对象各自保存的实例字段。", "共享常量应使用类名或接口名限定访问。"),
  debug("为什么实现类无法编译？", "interface Store { void save(); }\nclass FileStore implements Store { void save() {} }", "将方法声明为 `public void save() {}`，或把 FileStore 声明为 abstract。", "接口方法是 public，实现方法不能降低可见性。", "包内默认可见不满足接口的公开契约。", "实现接口方法时检查 public 修饰符。"),
  debug("两个 default 方法冲突时如何明确选择实现？", "interface Left { default void run() {} }\ninterface Right { default void run() {} }\nclass Task implements Left, Right {}", "在 Task 中重写 `public void run()`，并在需要时调用 `Left.super.run()` 或 `Right.super.run()`。", "两个不相关接口都提供 run 默认实现，类没有唯一可继承实现。", "冲突由具体类解决，而不是根据 implements 顺序选择。", "多接口默认方法重名时，显式覆盖并表达选择。"),
]);

add("foundation", "面向对象", "封装、static 与 final", [
  quiz("single", "`private` 实例字段最直接的设计目的是什么？", ["限制外部直接访问，并由类自身维护对象状态。", "自动让字段线程安全。", "阻止对象被垃圾回收。", "让字段在所有实例间共享。"], [0], "private 把直接访问限制在类内部，便于保护不变量。", "访问控制本身不提供同步，也不会改变字段是否静态。", "把验证规则放在负责状态的类中。"),
  quiz("single", "`static` 字段通常属于谁？", ["类本身，所有实例共享一份。", "每次方法调用独有一份。", "每个对象各自独有一份。", "只有子类对象拥有。"], [0], "静态字段与类关联，而非每个实例单独持有。", "static 不意味着值不可变；是否可变由字段类型和修饰符另定。", "共享可变 static 状态需要额外考虑并发与生命周期。"),
  quiz("multiple", "哪些声明表示不能被重新赋值或重写？", ["局部变量 `final int n` 在赋值后不能再赋值。", "`final` 实例方法不能被子类重写。", "`final` 类不能被继承。", "final 引用保证所指对象的字段也不可变。"], [0, 1, 2], "final 可限制变量重新赋值、方法重写和类继承。", "final 引用限制引用本身重新指向，不自动冻结对象状态。", "分清引用不可变与引用目标不可变。"),
  quiz("multiple", "关于静态上下文和实例成员，哪些说法正确？", ["static 方法没有隐式的当前对象 this。", "static 方法可以通过对象引用调用实例字段。", "实例方法可以直接访问同类 static 字段。", "static 字段的值在每个对象之间独立保存。"], [0, 2], "静态上下文没有当前实例；实例方法则可访问类成员和实例成员。", "访问实例字段必须有明确对象。", "编译器报非静态成员错误时，先确认是否缺少对象引用。"),
  output("执行结果是什么？", "class Meter { static int created; Meter() { created++; } }\nnew Meter(); new Meter();\nSystem.out.println(Meter.created);", "2", "两次构造都递增同一个类级别字段。", "静态字段不会因创建新实例而重置。", "统计对象数量时，static 字段常用于共享计数。"),
  output("程序输出什么？", "final int[] values = {1, 2};\nvalues[0] = 7;\nSystem.out.println(values[0]);", "7", "final 限制 values 不能改为引用另一个数组，但数组元素仍可修改。", "final 引用不等于不可变对象。", "深度不可变需要不可变对象设计，而不只是 final 引用。"),
  output("下列代码打印什么？", "class Config { static final int PORT = 8080; }\nSystem.out.println(Config.PORT);", "8080", "静态 final 字段保存共享常量值，可通过类名访问。", "常量命名惯例使用大写字母和下划线。", "final 用于不应重新赋值的常量或引用。"),
  debug("为什么 static 方法中访问 this 会编译失败？", "class Session {\n    static void show() { System.out.println(this); }\n}", "删除 static，将 show 声明为实例方法；或去掉 this 并明确需要访问的静态成员。", "static 方法调用没有当前对象，因此不存在 this。", "不要只为了访问实例成员而把方法误标为 static。", "判断方法是否属于对象行为，再决定是否需要实例上下文。"),
  debug("这个 final 数组为什么不能重新赋值但可以改元素？如何只暴露只读视图？", "final List<String> names = new ArrayList<>();\nnames.add(\"Ada\");", "final 仅禁止 names 重新指向其他 List；可用不可变副本或 `List.copyOf(names)` 暴露只读列表。", "集合引用仍指向可变对象，final 不阻止 add。", "调用方持有原始可变列表时，不可变视图和不可变副本也有区别。", "保护集合状态时同时控制引用和底层对象的可变性。"),
]);

add("foundation", "字符串", "相等性与不可变对象", [
  quiz("single", "重写 `equals` 时通常还必须一起重写什么？", ["hashCode。", "toString。", "clone。", "finalize。"], [0], "相等对象必须拥有相同 hashCode，否则哈希集合可能无法正确查找。", "反过来，相同 hashCode 并不保证 equals 为 true。", "定义值相等时同步维护 equals 和 hashCode 契约。"),
  quiz("single", "调用 `String.substring` 会如何影响原字符串？", ["返回新字符串结果，原 String 保持不变。", "原 String 从指定位置被裁掉。", "清空原字符串并复用对象。", "只会返回字符数组。"], [0], "String 不可变，substring 产生表示所选内容的 String 结果。", "忽略返回值时，转换结果不会保存在原变量中。", "把返回值赋回变量或交给下一个操作。"),
  quiz("multiple", "以下哪些符合 `equals` / `hashCode` 契约？", ["若 a.equals(b) 为 true，则两者 hashCode 必须相等。", "两个不同对象可以拥有相同 hashCode。", "hashCode 相等就一定 equals 为 true。", "equals 应满足对称性。"], [0, 1, 3], "哈希允许冲突；equals 对称且相等对象必须产生相同哈希值。", "哈希值只是筛选线索，不是唯一对象标识。", "自定义值对象时使用一致的字段集合实现两种方法。"),
  quiz("multiple", "为什么不应把可变字段纳入哈希键后再修改它？", ["哈希桶位置依赖插入时的哈希值。", "修改后再查找可能无法按新哈希找到该键。", "HashMap 会自动把旧键移动到正确桶。", "适合作键的对象通常应保持参与相等比较的状态稳定。"], [0, 1, 3], "键放入哈希表后若其哈希相关状态变化，桶索引与当前 hashCode 不一致。", "HashMap 不会侦测键对象字段并自动重排。", "使用不可变键或确保作为键期间不改变相等性状态。"),
  output("输出什么？", "String value = \"study\";\nvalue.replace(\"u\", \"a\");\nSystem.out.println(value);", "study", "replace 返回新 String，但返回值未接收，value 仍是 study。", "不可变字符串操作不会原地改写变量所指对象。", "需要变换结果时保存方法返回值。"),
  output("两个判断依次输出什么？", "String a = \"cat\";\nString b = \"c\" + \"at\";\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));", "true\ntrue", "这两个常量表达式在编译期可折叠为相同字符串常量；equals 也比较相同内容。", "常量池行为不应成为比较字符串内容的写法依据。", "业务语义要比较文本内容时始终使用 equals。"),
  output("这两个对象是否相等？", "record Point(int x, int y) {}\nPoint p = new Point(2, 3);\nPoint q = new Point(2, 3);\nSystem.out.println(p.equals(q));", "true", "record 自动生成基于组件值的 equals 实现。", "record 的组件引用本身仍可能指向可变对象。", "record 适合表达以数据为中心的浅层值类型。"),
  debug("为什么这个类放进 HashSet 后无法按预期去重？", "class Key { int id; public boolean equals(Object o) { return o instanceof Key k && id == k.id; } }", "同时重写 hashCode，并基于相同的 id 字段计算哈希值。", "equals 认为相同 id 相等，但继承的 Object.hashCode 可能不同。", "HashSet 先用 hashCode 定位，再用 equals 比较。", "相等性规则与哈希计算必须使用一致状态。"),
  debug("为什么小写结果没有被打印？", "String text = \"JAVA\";\ntext.toLowerCase();\nSystem.out.println(text);", "将返回值保存：`text = text.toLowerCase();`。", "String 不可变，toLowerCase 不会改写原内容。", "转换方法返回新值；忽略返回值会丢失结果。", "值对象的转换应显式接收返回对象。"),
]);

add("foundation", "异常", "异常传播与资源关闭", [
  quiz("single", "`finally` 块通常何时执行？", ["离开 try/catch 控制流时通常执行，包括发生异常的情况。", "只有 try 正常结束时执行。", "只有 catch 捕获异常后执行。", "只在 JVM 正常退出时执行。"], [0], "finally 常用于清理，在离开 try/catch 时运行。", "调用 System.exit 或进程突然终止等情况可能绕过 finally。", "需要可靠关闭资源时优先考虑 try-with-resources。"),
  quiz("single", "try-with-resources 要求资源类型通常满足什么条件？", ["实现 AutoCloseable。", "实现 Serializable。", "必须继承 Thread。", "必须是 static 字段。"], [0], "编译器会在适当时机调用资源的 close 方法，资源需实现 AutoCloseable。", "Closeable 是其子接口，常见 IO 类型也支持该机制。", "用 try-with-resources 表达明确的资源所有权边界。"),
  quiz("multiple", "关于受检异常，哪些描述正确？", ["调用可能抛出受检异常的方法时需捕获或声明。", "RuntimeException 的子类通常属于非受检异常。", "Error 通常要求每个调用点都捕获。", "catch 子类异常后，再写父类异常 catch 会不可达。"], [0, 1, 3], "受检异常由编译器检查；非受检异常通常是 RuntimeException 或 Error 的子类。", "先捕获更具体类型，否则其后的父类 catch 可能不可达。", "只捕获能够处理或转换的异常，避免空 catch。"),
  quiz("multiple", "关于 try-with-resources，哪些说法正确？", ["资源按声明的逆序关闭。", "即使 try 块抛异常，已创建资源也会尝试关闭。", "必须手动在 finally 中再次调用 close。", "多个资源可在资源头中依次声明。"], [0, 1, 3], "资源会自动关闭，关闭顺序与初始化顺序相反。", "通常不要重复手动 close，否则可能重复释放。", "声明资源后让语言结构承担正常清理责任。"),
  output("最后输出什么？", "try { System.out.print(\"T\"); } finally { System.out.print(\"F\"); }", "TF", "try 主体先打印 T，随后 finally 打印 F。", "finally 不是在 try 前执行。", "按实际控制流顺序追踪输出与清理。"),
  output("方法返回值是什么？", "static int value() { try { return 1; } finally { System.out.print(\"F\"); } }\nSystem.out.println(\"R\" + value());", "FR1", "调用 value 时先在 finally 打印 F，随后返回 1；外层打印 R1。", "finally 中若再执行 return 会覆盖先前返回值，通常应避免。", "finally 用于清理，不要在其中改变控制流结果。"),
  output("资源关闭前后会打印什么？", "class Tracked extends java.io.StringReader { boolean closed; Tracked() { super(\"x\"); } public void close() { closed = true; } }\nTracked in = new Tracked();\ntry (in) { System.out.println((char) in.read()); }\nSystem.out.println(in.closed);", "x\ntrue", "StringReader 读取 x；离开 try-with-resources 后自动调用覆盖的 close，将 closed 设为 true。", "try-with-resources 会在资源初始化成功后负责关闭。", "用可观察的 close 状态验证资源清理时序。"),
  debug("为什么第二个 catch 不可达？怎样调整顺序？", "try { work(); } catch (Exception e) { recover(); } catch (IOException e) { retry(); }", "将 `catch (IOException e)` 放到 `catch (Exception e)` 前。", "IOException 是 Exception 的子类，前一个 catch 已能捕获它。", "catch 应从更具体的异常类型排到更一般的类型。", "阅读异常继承关系来判断 catch 的覆盖范围。"),
  debug("怎样保证 reader 在读取成功或抛异常后都会关闭？", "var reader = new java.io.FileReader(path);\nint first = reader.read();", "将资源放入 `try (var reader = new java.io.FileReader(path)) { ... }`。", "当前代码没有关闭 reader，发生异常时更无法可靠清理。", "FileReader 实现 AutoCloseable。", "把资源声明到 try-with-resources 头中。"),
]);

add("foundation", "继承与多态", "抽象类与协变返回", [
  quiz("single", "抽象类最适合用来表达什么？", ["含有共同状态或实现，并要求子类补全部分行为的基类。", "完全不能声明字段和构造器的类型。", "可以直接创建实例的工具类。", "只能由一个类实现的接口别名。"], [0], "抽象类可组合字段、构造器、具体方法和抽象方法，但不能直接实例化。", "抽象类也可以没有抽象方法，关键在于类型不能被直接构造。", "为共享实现建立父类时，避免把所有行为都强塞给子类。"),
  quiz("single", "子类重写方法可以把父类返回类型改成什么？", ["引用类型的合法子类型（协变返回类型）。", "任意不相关类型。", "只能改成 void。", "返回类型必须比父类更宽。"], [0], "引用类型返回值允许使用协变类型，重写实现返回父类返回类型的子类型。", "基本类型返回值不能这样协变。", "确认返回类型可赋给父类方法声明的返回类型。"),
  quiz("multiple", "关于抽象类，哪些描述正确？", ["可以包含抽象方法和具体方法。", "不能直接使用 new 创建抽象类实例。", "抽象子类可以暂不实现父类所有抽象方法。", "抽象类不能声明构造器。"], [0, 1, 2], "抽象类可保留未实现契约，直到某个具体子类完成实现。", "构造器参与子类构造，但抽象类仍不能独立实例化。", "把抽象类型与其子类的实例化边界分清。"),
  quiz("multiple", "以下哪些对子类构造过程的描述正确？", ["创建子类对象时会先构造父类部分。", "未显式指定时，子类构造器会尝试调用父类无参构造器。", "子类构造器可以在任意位置调用 super(...)。", "父类没有可访问无参构造器时，子类需显式调用可用父类构造器。"], [0, 1, 3], "父类部分必须先初始化；super(...) 显式构造调用必须位于首行。", "父类构造器缺失会让隐式 super() 无法解析。", "检查继承链上每层构造器的可访问性与调用顺序。"),
  output("这个重写调用返回哪种类型的名字？", "class Animal {}\nclass Dog extends Animal {}\nclass Factory { Animal create() { return new Animal(); } }\nclass DogFactory extends Factory { @Override Dog create() { return new Dog(); } }\nSystem.out.println(new DogFactory().create().getClass().getSimpleName());", "Dog", "子类方法采用合法协变返回 Dog，因此创建并返回 Dog 实例。", "重写方法的返回类型必须满足父类签名的赋值兼容性。", "协变返回类型让具体工厂可暴露更具体的结果。"),
  output("输出顺序是什么？", "class Parent { Parent() { print(); } void print() { System.out.print(\"P\"); } }\nclass Child extends Parent { int value = 7; @Override void print() { System.out.print(value); } }\nnew Child();", "0", "父类构造期间会动态调用子类重写的 print，但子类字段初始化尚未执行，value 仍为默认值 0。", "构造器中调用可重写方法会暴露未初始化的子类状态。", "构造期间尽量避免调用可被子类覆盖的方法。"),
  output("执行构造后输出什么？", "class Base { int n = 1; Base() { n += 2; } }\nclass Sub extends Base { int m = 4; Sub() { m += n; } }\nSub s = new Sub();\nSystem.out.println(s.n + \":\" + s.m);", "3:7", "先初始化父类 n=1，再执行父类构造变成 3；子类字段 m=4 后，子类构造把 n 加到 m 得 7。", "父类初始化和构造在子类字段初始化之前完成。", "继承构造题按父类到子类逐段模拟。"),
  debug("为什么子类构造器没有匹配到 super()？", "class Base { Base(String name) {} }\nclass Child extends Base { Child() {} }", "在 Child 构造器首行写 `super(\"name\")`，或给 Base 增加可访问的无参构造器。", "编译器隐式插入 super()，但 Base 只提供带参构造器。", "父类没有无参构造器时，子类必须显式选一个父类构造器。", "每个构造器的第一步都必须形成合法的父类初始化链。"),
  debug("如何避免父类构造期间访问到未初始化的子类字段？", "class Base { Base() { initialize(); } void initialize() {} }\nclass Child extends Base { int limit = 10; @Override void initialize() { System.out.println(limit); } }", "避免在 Base 构造器中调用可重写方法；把初始化逻辑留给显式构造步骤或私有方法。", "父类构造调用到 Child.initialize 时，Child 字段初始化还未发生。", "动态分派在构造期间仍然生效。", "构造器保持简单，不向子类暴露半初始化对象。"),
]);

add("foundation", "类与对象", "record 与值对象", [
  quiz("single", "record 的主要用途是什么？", ["简洁表达以组件数据为中心的不可继承数据载体。", "替代所有可变业务实体。", "自动深拷贝每一个组件对象。", "只能包含 static 字段。"], [0], "record 为数据载体生成组件访问器、构造器、equals、hashCode 和 toString 等成员。", "组件对象若可变，record 不会自动深度冻结它。", "选择 record 前确认其值语义和浅层不可变性适合需求。"),
  quiz("single", "record 的组件访问方式通常是什么？", ["调用与组件同名的访问器，例如 `point.x()`。", "必须直接访问 public 字段 `point.x`。", "调用 getX()，编译器总会生成 JavaBean getter。", "通过静态方法访问。"], [0], "record 组件会生成同名访问器方法。", "record 默认不生成 getX 风格的 JavaBean getter。", "使用组件名访问器表达 record 数据。"),
  quiz("multiple", "关于 record，哪些描述正确？", ["record 隐式继承 Record 类。", "record 不能显式继承另一个类。", "record 可以实现接口。", "record 的组件字段默认可被任意外部代码修改。"], [0, 1, 2], "record 有固定的类继承位置，但仍可实现接口。", "组件字段为 private final，外部通常通过访问器读取。", "组件引用 final 不代表其引用的对象深度不可变。"),
  quiz("multiple", "设计值对象时，哪些行为有助于可靠相等性？", ["equals 与 hashCode 使用一致的值字段。", "将关键状态设为不可变或避免创建后修改。", "把对象身份与内容相等混为一个规则。", "只要返回同一 hashCode 就能证明对象相等。"], [0, 1], "稳定的相等字段与一致 hashCode 有利于在集合中可靠使用值对象。", "哈希冲突存在，hashCode 相同不代表 equals。", "值对象优先采用明确且稳定的值语义。"),
  output("输出结果是什么？", "record Size(int width, int height) {}\nSize a = new Size(2, 5);\nSystem.out.println(a.width() * a.height());", "10", "width() 返回 2，height() 返回 5，乘积为 10。", "record 访问器使用组件名，不会自动生成 getWidth。", "record 适合紧凑表达数据参数。"),
  output("下面两项依次是什么？", "record User(String name) {}\nUser a = new User(\"Mia\");\nUser b = new User(\"Mia\");\nSystem.out.println(a.equals(b) + \":\" + a);", "true:User[name=Mia]", "record 自动按组件值比较，并生成包含组件名称和值的 toString。", "record 自动方法是浅层的；引用组件的内部变化需要谨慎。", "减少纯数据类型的样板代码，同时了解生成行为。"),
  output("输出是否相同？", "record Pair(int left, int right) {}\nSystem.out.println(new Pair(1, 2).hashCode() == new Pair(1, 2).hashCode());", "true", "两个 record 值相等，生成的 hashCode 对相同组件产生相同结果。", "不同值也可能出现哈希冲突。", "哈希码用于散列，不是唯一 ID。"),
  debug("为什么这个 record 声明非法？", "record Token(String value) {\n    String value;\n}", "删除重复字段声明；record 组件已经声明了对应的 private final 字段。", "组件字段由 record 语法生成，不能再声明同名实例字段。", "可以在规范构造器中校验或规范化组件值。", "把不变量放入构造过程，而不是重复定义组件存储。"),
  debug("如何拒绝 null 名称并保持 record 简洁？", "record User(String name) {}", "使用紧凑构造器：`User { Objects.requireNonNull(name); }`。", "默认构造器不会自动验证引用组件非 null。", "验证需要导入 java.util.Objects。", "在值对象边界集中校验必需组件。"),
]);

add("advanced", "集合", "List 与可变性", [
  quiz("single", "`List.of(1, 2)` 返回的列表有什么限制？", ["不可修改，且不能包含 null。", "可添加元素但不能删除。", "总是由 ArrayList 实现。", "内容会自动排序。"], [0], "List.of 创建不可修改列表，且会拒绝 null 元素。", "不可修改列表与可修改副本是不同对象策略。", "明确列表是只读快照还是可变工作集合。"),
  quiz("single", "`Arrays.asList(array)` 返回的列表具有什么特性？", ["固定大小，元素位置与原数组相互关联。", "可任意增删且完全复制数组。", "自动使用 Set 消除重复。", "按字典序对数组排序。"], [0], "Arrays.asList 使用给定数组支持固定大小列表，set 可更新对应数组槽位。", "add 与 remove 会改变大小，因此通常不支持。", "需要独立可变列表时可用 `new ArrayList<>(...)`。"),
  quiz("multiple", "关于 List，哪些说法正确？", ["List 允许按索引访问元素。", "`List.of` 创建的列表支持 set。", "List 可以包含重复元素。", "`ArrayList` 的 `add` 通常会追加到末尾。"], [0, 2, 3], "List 保留位置次序且允许重复；ArrayList 的常见 add 会追加元素。", "接口 List 不代表某一具体可变性实现。", "调用修改操作前确认实际列表实现是否可变。"),
  quiz("multiple", "关于 `List<Integer>` 中的删除重载，哪些描述正确？", ["`remove(1)` 选择按索引删除。", "`remove(Integer.valueOf(1))` 选择按对象删除。", "两个写法都一定删除值为 1 的元素。", "若列表为空，`remove(1)` 会抛 IndexOutOfBoundsException。"], [0, 1, 3], "remove(int) 删除索引；remove(Object) 删除首次匹配对象。", "基本类型实参 1 优先匹配 int 索引重载。", "泛型包装类型列表里，明确对象删除时写出 Integer.valueOf。"),
  output("最终列表是什么？", "var items = new java.util.ArrayList<>(java.util.List.of(2, 4));\nitems.add(6);\nitems.set(0, 1);\nSystem.out.println(items);", "[1, 4, 6]", "先复制为可变 ArrayList，再追加 6 并把索引 0 替换为 1。", "List.of 本身不可修改，外层 ArrayList 才能增删。", "追踪列表操作时记录每次索引和值的变化。"),
  output("数组和列表依次输出什么？", "Integer[] values = {1, 2};\nvar view = java.util.Arrays.asList(values);\nview.set(0, 9);\nSystem.out.println(values[0] + \":\" + view.size());", "9:2", "Arrays.asList 的固定大小视图共享原数组槽位；set 改变 values[0]。", "视图允许替换元素，但不能改变列表长度。", "明确区分视图与复制。"),
  output("执行后列表内容是什么？", "var xs = new java.util.ArrayList<>(java.util.List.of(10, 20, 30));\nxs.remove(1);\nSystem.out.println(xs);", "[10, 30]", "整数参数调用 remove(int index)，删除下标 1 处的 20。", "remove(1) 不会按 Integer 值删除 1。", "同名重载的选择依据编译期参数类型。"),
  debug("为什么 `add` 会抛 UnsupportedOperationException？", "List<String> names = List.of(\"Ada\");\nnames.add(\"Lin\");", "改用 `new ArrayList<>(List.of(\"Ada\"))` 创建可变列表后再添加。", "List.of 返回不可修改列表，静态类型 List 不保证可变。", "UnsupportedOperationException 是实现不支持该可选操作的信号。", "容器类型声明不能说明它是否可变。"),
  debug("怎样既保留 Arrays.asList 的元素，又能增删？", "var fixed = java.util.Arrays.asList(\"a\", \"b\");\nfixed.add(\"c\");", "复制到新 ArrayList：`var editable = new ArrayList<>(fixed); editable.add(\"c\");`。", "Arrays.asList 返回固定大小列表，不能通过 add 扩容。", "直接修改该视图的既有元素仍会反映到支持它的数组。", "对外部数组视图先复制，再执行结构性修改。"),
]);

add("advanced", "集合", "Set 与相等性", [
  quiz("single", "HashSet 判断两个普通对象是否重复时主要依赖什么？", ["先比较 hashCode，再在同桶候选间使用 equals。", "只比较对象的内存地址文本。", "只比较 toString 输出。", "总按插入顺序比较。"], [0], "哈希集合通过 hashCode 定位候选，再用 equals 判断相等性。", "hashCode 相同并不保证 equals 为 true。", "自定义集合元素应正确实现 equals 与 hashCode。"),
  quiz("single", "需要稳定保留插入顺序的 Set，常用哪种实现？", ["LinkedHashSet。", "HashSet。", "TreeSet。", "IdentityHashMap。"], [0], "LinkedHashSet 维护插入顺序；HashSet 不承诺迭代顺序，TreeSet 按排序规则迭代。", "Set 接口本身不承诺具体遍历顺序。", "根据顺序需求选择实现，而非依赖偶然观察到的顺序。"),
  quiz("multiple", "关于 Set，哪些描述正确？", ["Set 通常不允许按 equals 相等的元素重复出现。", "HashSet 承诺按插入顺序迭代。", "TreeSet 通常依据比较器或自然顺序确定唯一性。", "LinkedHashSet 维护可预测的插入迭代顺序。"], [0, 2, 3], "TreeSet 通过排序比较确定元素组织；LinkedHashSet 保留插入顺序。", "HashSet 不保证迭代顺序。", "需要稳定顺序时把要求写在实现选择中。"),
  quiz("multiple", "向 HashSet 存放自定义对象时，哪些做法可靠？", ["为值相等的对象实现一致的 equals 和 hashCode。", "对象存入后修改参与哈希的字段可能破坏查找。", "只重写 toString 即可定义去重规则。", "哈希碰撞后集合还会用 equals 区分对象。"], [0, 1, 3], "HashSet 同时使用散列和相等性；参与两者的状态应稳定。", "toString 仅用于文本表示，不定义对象相等性。", "优先使用不可变的集合键对象。"),
  output("集合大小是多少？", "var values = new java.util.HashSet<>(java.util.List.of(2, 2, 3, 3, 3));\nSystem.out.println(values.size());", "2", "Set 保留唯一元素 2 和 3。", "输入列表中的重复项不会成为集合中的重复元素。", "Set size 反映相等性规则下的不同元素数。"),
  output("程序按什么顺序输出？", "var values = new java.util.LinkedHashSet<>(java.util.List.of(\"b\", \"a\", \"b\", \"c\"));\nSystem.out.println(values);", "[b, a, c]", "重复的第二个 b 不再插入，剩余元素按首次插入顺序迭代。", "去重不会把元素按字母排序。", "需要排序时选用 TreeSet 或显式排序。"),
  output("TreeSet 中保留多少个元素？", "var values = new java.util.TreeSet<>(java.util.List.of(4, 1, 4, 2));\nSystem.out.println(values);", "[1, 2, 4]", "TreeSet 按自然顺序排列并移除比较结果为 0 的重复元素。", "比较器一致性会影响 TreeSet 对元素重复的判断。", "自定义比较器时确认 compare 的相等关系符合预期。"),
  debug("为什么改变 key.id 后 contains 可能返回 false？", "var set = new java.util.HashSet<Key>();\nKey key = new Key(1);\nset.add(key);\nkey.id = 2;", "不要修改参与 equals/hashCode 的字段；可使用不可变 Key，或先 remove 后修改再 add。", "修改 id 后 hashCode 变化，元素仍在旧桶中。", "即使同一对象引用，哈希桶定位也可能与当前哈希值不一致。", "哈希集合中的键在驻留期间保持相等性状态不变。"),
  debug("怎样让这个 Set 按字母顺序迭代？", "var tags = new java.util.HashSet<>(java.util.List.of(\"z\", \"a\", \"m\"));", "使用 `new TreeSet<>(tags)`，或将元素复制到列表后排序。", "HashSet 不承诺稳定或自然排序顺序。", "偶然出现的某次迭代顺序不能作为契约。", "将排序需求交给有序容器或显式排序操作。"),
]);

add("advanced", "Map", "映射更新与查找", [
  quiz("single", "调用 `map.get(key)` 返回 null，可能表示什么？", ["键不存在，或键存在但映射到 null（若该实现允许 null）。", "一定表示键存在且值是 null。", "一定表示 Map 为空。", "必然抛出异常。"], [0], "get 返回 null 时通常无法单独区分不存在和映射为 null，可用 containsKey 判断。", "不同 Map 实现对 null 键和值的支持不同。", "对可能存在空值的映射先检查 containsKey。"),
  quiz("single", "`Map.merge(key, value, remappingFunction)` 常用于什么？", ["键缺失时加入给定值，已存在时按函数合并。", "把 Map 按键排序。", "总是无条件覆盖成 value。", "删除所有 null 值。"], [0], "merge 对缺失或 null 映射建立值，对已有非 null 值执行合并函数。", "合并函数返回 null 时会删除该映射。", "计数累加常用 `merge(key, 1, Integer::sum)`。"),
  quiz("multiple", "关于 Map，哪些说法正确？", ["一个键最多映射到一个值。", "`put` 返回该键先前映射的值。", "Map 的所有实现都允许 null 键。", "`containsKey` 可区分不存在与映射到 null 的键。"], [0, 1, 3], "Map 以键唯一性组织映射，put 可返回旧值，containsKey 可判断键是否存在。", "例如 ConcurrentHashMap 不允许 null 键和值。", "阅读具体实现契约，不要假设接口所有实现支持相同 null 策略。"),
  quiz("multiple", "关于 HashMap 遍历，哪些说法正确？", ["可以遍历 `entrySet()` 同时取得键和值。", "普通 HashMap 不保证迭代顺序。", "遍历时对 Map 结构性修改通常安全且受支持。", "按键排序需要显式选用有序 Map 或排序键。"], [0, 1, 3], "entrySet 能直接读取键值对；HashMap 不提供排序保证。", "结构性修改可能触发 fail-fast 检测，应使用迭代器 remove 或并发设计。", "迭代顺序和并发修改都应按集合契约处理。"),
  output("打印的映射是什么？", "var counts = new java.util.HashMap<String, Integer>();\ncounts.merge(\"java\", 1, Integer::sum);\ncounts.merge(\"java\", 1, Integer::sum);\nSystem.out.println(counts.get(\"java\"));", "2", "第一次 merge 建立计数 1，第二次用 Integer::sum 合并为 2。", "键第一次出现时不会调用已有值合并函数。", "merge 简化存在则更新、缺失则初始化的计数逻辑。"),
  output("输出结果是什么？", "var map = new java.util.LinkedHashMap<String, Integer>();\nmap.put(\"x\", 1); map.put(\"y\", 2); map.put(\"x\", 3);\nSystem.out.println(map);", "{x=3, y=2}", "更新 x 的值不会重新插入键，插入顺序仍为 x 后 y。", "LinkedHashMap 默认保持插入顺序；访问顺序模式需另行配置。", "更新映射值与改变键迭代位置要分别判断。"),
  output("TreeMap 会以什么顺序打印键？", "var map = new java.util.TreeMap<Integer, String>();\nmap.put(8, \"e\"); map.put(2, \"b\"); map.put(5, \"c\");\nSystem.out.println(map.keySet());", "[2, 5, 8]", "TreeMap 按键自然顺序迭代。", "排序由键比较器决定，不由插入顺序决定。", "当操作依赖范围或有序遍历时考虑 TreeMap。"),
  debug("为什么这段代码在缺失键时会发生空指针异常？", "Integer count = counts.get(\"missing\");\nint next = count + 1;", "先用 `getOrDefault(\"missing\", 0)`，或使用 merge/computeIfAbsent 初始化。", "键不存在时 get 返回 null，自动拆箱会触发 NullPointerException。", "包装类型可能为 null，拆箱前应确认值存在。", "用 getOrDefault 表达缺失映射的默认值。"),
  debug("怎样在保留 Map 的同时安全删除所有值为负数的映射？", "for (var entry : map.entrySet()) {\n    if (entry.getValue() < 0) map.remove(entry.getKey());\n}", "使用 `map.entrySet().removeIf(entry -> entry.getValue() < 0);`，或通过 Iterator.remove 删除。", "增强 for 遍历期间直接结构性修改 Map 可能触发 ConcurrentModificationException。", "fail-fast 是错误检测机制，不提供并发安全保证。", "通过当前迭代器或集合视图支持的删除操作修改结构。"),
]);

add("advanced", "泛型", "类型参数与通配符", [
  quiz("single", "为什么不能把 `List<Integer>` 赋给 `List<Number>`？", ["泛型默认是不变的，避免通过 List<Number> 写入 Double 到 Integer 列表。", "Integer 不是 Number 的子类。", "List 不能使用引用类型。", "泛型只适用于数组。"], [0], "Integer 是 Number 子类，但 List<Integer> 并不是 List<Number> 子类。", "若允许协变赋值，接收端就可能写入不匹配的元素。", "区分元素类型继承关系和参数化容器类型关系。"),
  quiz("single", "方法只需要读取 Number 列表中的元素，常用哪种参数？", ["`List<? extends Number>`。", "`List<?>` 并允许写入 Double。", "`List<Number>`。", "`List<? super Integer>` 并把读出值当 Integer。"], [0], "上界通配符表示元素类型是 Number 或其子类型，适合从集合读取 Number。", "通过 extends 声明上界，不意味着集合只含直接的 Number。", "生产者用 extends：从源集合取值。"),
  quiz("multiple", "关于通配符，哪些说法正确？", ["`? extends T` 适合读取为 T。", "`? super T` 可以安全写入 T。", "从 `List<? extends Number>` 中可直接添加 Integer。", "`List<?>` 可读取元素为 Object。"], [0, 1, 3], "上界可安全读为 T；下界可安全写入 T；未知类型集合读取只能保证为 Object。", "extends 集合的具体子类型未知，通常不能安全添加非 null 值。", "PECS：生产者用 extends，消费者用 super。"),
  quiz("multiple", "以下哪些设计符合泛型规则？", ["方法可声明自己的类型参数 `<T> T first(List<T> values)`。", "`List<String>` 可以安全当作 `List<Object>`。", "限定参数可以写成 `<T extends Number>`。", "`List<String>` 与 `List<Integer>` 在运行时通常共用擦除后的 List 类。"], [0, 2, 3], "类型参数可在方法或类声明；T 可受边界约束，运行时采用类型擦除。", "泛型不变，String 列表不是 Object 列表。", "避免向参数化列表写入运行时不匹配元素。"),
  output("编译期推断出的 first 返回值是什么？", "static <T> T first(java.util.List<T> items) { return items.get(0); }\nString name = first(java.util.List.of(\"A\", \"B\"));\nSystem.out.println(name);", "A", "实参列表的元素类型为 String，类型参数 T 推断为 String，返回首元素 A。", "泛型提供编译期类型关系，不需要在调用处强转。", "沿着实参类型跟踪类型参数推断。"),
  output("下面读取到的值是什么？", "static double total(java.util.List<? extends Number> xs) { return xs.get(0).doubleValue(); }\nSystem.out.println(total(java.util.List.of(3)));", "3.0", "列表元素类型是 Integer，Integer 继承 Number 并提供 doubleValue。", "上界通配符适用于读取，不代表可以添加任意 Number。", "对多个数值子类型统一读取时使用 Number 上界。"),
  output("程序会输出什么？", "static void addOne(java.util.List<? super Integer> out) { out.add(1); }\nvar values = new java.util.ArrayList<Number>();\naddOne(values);\nSystem.out.println(values.get(0));", "1", "Number 是 Integer 的父类型，`? super Integer` 接受该列表并能安全写入 Integer。", "读出值只保证为 Object，不能直接当成 Integer。", "消费者集合使用 super 下界。"),
  debug("为什么无法把这个 List 传给方法？", "static void print(java.util.List<Number> values) {}\njava.util.List<Integer> ints = java.util.List.of(1, 2);\nprint(ints);", "若只读取，参数改为 `List<? extends Number>`；若要写入不同 Number，创建 `List<Number>`。", "List<Integer> 与 List<Number> 泛型不变，不能直接赋值。", "把集合当作只读源或可写目标后，再设计通配符方向。", "用 PECS 规则表达调用方的读取或写入意图。"),
  debug("为什么不能重载这两个方法？", "void show(java.util.List<String> values) {}\nvoid show(java.util.List<Integer> values) {}", "改为不同方法名，或使用不同的可区分参数列表；两者擦除后签名冲突。", "泛型类型实参在运行时擦除，两种签名都会变成 show(List)。", "不能依赖运行时泛型参数来区分方法重载。", "检查擦除后的方法签名是否相同。"),
]);

add("advanced", "Stream", "流水线求值与转换", [
  quiz("single", "Stream 中间操作（如 filter、map）通常何时执行？", ["遇到终端操作时惰性执行。", "调用 filter 的瞬间立刻遍历全部元素。", "只在关闭 Stream 时执行。", "每次创建 Stream 都自动保存到集合。"], [0], "中间操作构建流水线；终端操作触发遍历与计算。", "若没有终端操作，通常不会执行实际遍历。", "先构造 transformation，再用 collect、count 或 forEach 结束。"),
  quiz("single", "要把 `List<List<T>>` 转为一个元素流，最合适的操作通常是什么？", ["flatMap。", "filter。", "peek。", "distinct。"], [0], "flatMap 把每个输入映射为流，再将这些流合并成单层流。", "map 会保留嵌套层次，结果可能是 Stream<Stream<T>>。", "将一对多映射展平时使用 flatMap。"),
  quiz("multiple", "关于 Stream，哪些说法正确？", ["同一 Stream 通常只能消费一次。", "filter 和 map 是中间操作。", "count 是终端操作。", "调用 sorted 后原始 List 一定被原地排序。"], [0, 1, 2], "Stream 具有一次性流水线；中间操作组合，终端操作触发求值。", "Stream 排序产生流水线结果，不修改源 List。", "需要原地排序时使用集合排序 API。"),
  quiz("multiple", "关于 Stream 遍历顺序与状态，哪些说法正确？", ["有序流的 forEachOrdered 会按遇到顺序执行动作。", "在并行流 lambda 中修改共享 ArrayList 通常不安全。", "无状态的 map/filter 通常更容易并行处理。", "Stream API 保证任意有副作用流水线结果确定。"], [0, 1, 2], "顺序语义与共享状态很重要；无状态操作更适合并行分段执行。", "外部共享副作用会引入竞态和不可预测顺序。", "优先写无副作用转换，终端收集由框架管理。"),
  output("结果列表是什么？", "var result = java.util.List.of(1, 2, 3, 4).stream()\n    .filter(n -> n % 2 == 0).map(n -> n * 10).toList();\nSystem.out.println(result);", "[20, 40]", "filter 保留偶数 2、4，map 将其乘 10。", "toList 返回的列表不可修改。", "按流水线顺序追踪每个元素经过的操作。"),
  output("count 的结果是多少？", "long count = java.util.List.of(\"a\", \"ab\", \"b\").stream()\n    .filter(s -> s.length() == 1).count();\nSystem.out.println(count);", "2", "长度为 1 的元素有 a 和 b，共两个。", "count 是终端操作，运行后该 Stream 不能再次使用。", "把中间筛选条件转成逐元素判断。"),
  output("打印的列表是什么？", "var lengths = java.util.List.of(\"java\", \"vm\").stream()\n    .map(String::length).toList();\nSystem.out.println(lengths);", "[4, 2]", "方法引用 String::length 将每个字符串映射为长度。", "map 改变流元素类型，从 String 变成 Integer。", "用方法引用替代只转发参数的简单 lambda。"),
  debug("为什么这个 Stream 第二次终端操作会抛 IllegalStateException？", "var stream = java.util.List.of(1, 2).stream();\nlong count = stream.count();\nstream.forEach(System.out::println);", "每个终端操作创建并使用一个新的 Stream：再次调用 `list.stream()` 后再遍历。", "终端操作已消费 stream，Stream 不可复用。", "保存源集合，而不是缓存已经消费的流。", "每条流水线只执行一次。"),
  debug("为什么没有打印任何内容？", "java.util.List.of(1, 2, 3).stream()\n    .peek(System.out::println);", "追加终端操作，例如 `.forEach(System.out::println)`，或收集结果。", "peek 是中间操作，不会自行触发 Stream 求值。", "调试时不要把 peek 当作终端输出操作。", "流水线必须由终端操作启动。"),
]);

add("advanced", "Stream", "聚合、去重与排序", [
  quiz("single", "`Collectors.groupingBy(classifier, counting())` 的结果通常是什么？", ["按分类键映射到 Long 计数的 Map。", "只保留第一个元素的 List。", "按键自然排序的 Set。", "一个不可重复消费的 Stream。"], [0], "groupingBy 按 classifier 的结果分组，counting 为每组计算元素数。", "分组 Map 的具体实现及顺序应查看 API 契约，不要假设排序。", "聚合目标是分类统计时用 groupingBy 配合下游 collector。"),
  quiz("single", "没有初始值的 `Stream.reduce` 为什么通常返回 Optional？", ["流可能为空，无法确定累积结果。", "reduce 只能处理引用类型。", "Optional 表示结果一定是 null。", "并行流不支持直接返回值。"], [0], "无初始值 reduce 在空流上没有结果，因此用 Optional 表示可能不存在。", "带 identity 的 reduce 在空流上可返回 identity。", "选择 reduce 重载时明确空流语义。"),
  quiz("multiple", "关于排序与去重，哪些说法正确？", ["sorted 可以接受 Comparator。", "distinct 使用元素的 equals 判断重复。", "Stream.sorted 会原地修改源集合。", "Comparator.comparing 可按对象属性构造比较器。"], [0, 1, 3], "Stream distinct 依赖相等性，sorted 通过自然顺序或比较器产生排序流。", "集合源不会因 Stream sorted 被直接修改。", "选择比较键时确认 null 值和相同排序键的处理。"),
  quiz("multiple", "使用 collector 汇总时，哪些做法合理？", ["`Collectors.toList()` 收集流元素到 List。", "`Collectors.joining(\",\")` 可连接字符串流。", "`Collectors.toMap` 遇到重复键时若无合并函数可能抛异常。", "任何 Collector 都保证返回的集合可变且线程安全。"], [0, 1, 2], "不同 collector 表达不同终结汇总；toMap 重复键需明确合并策略。", "返回集合的可变性和并发保证依 collector 而定。", "处理可能重复的键时提供 merge function。"),
  output("按长度分组后的 key 2 对应多少元素？", "var grouped = java.util.List.of(\"a\", \"bc\", \"de\", \"f\").stream()\n    .collect(java.util.stream.Collectors.groupingBy(String::length, java.util.stream.Collectors.counting()));\nSystem.out.println(grouped.get(2));", "2", "长度为 2 的字符串有 bc 和 de。", "counting 的统计结果类型为 Long。", "先确定分类键，再统计每组元素数。"),
  output("连接后的字符串是什么？", "String result = java.util.List.of(\"A\", \"B\", \"C\").stream()\n    .collect(java.util.stream.Collectors.joining(\"-\"));\nSystem.out.println(result);", "A-B-C", "joining 以连字符把流中三个字符串按遇到顺序连接。", "遇到顺序只有在有序源与对应操作中才有确定意义。", "格式化拼接比在 forEach 中修改共享 StringBuilder 更清晰。"),
  output("输出排序结果是什么？", "var values = java.util.List.of(\"pear\", \"kiwi\", \"fig\").stream()\n    .sorted(java.util.Comparator.comparingInt(String::length)).toList();\nSystem.out.println(values);", "[fig, kiwi, pear]", "按长度升序，长度依次为 3、4、4；稳定排序保留 kiwi 在 pear 前。", "比较器只比较长度时，两项长度相等。", "若同键元素还需固定顺序，追加次级比较器。"),
  debug("为什么 toMap 无法决定相同首字母的值？如何保留较长字符串？", "var map = java.util.List.of(\"ant\", \"apple\").stream()\n    .collect(java.util.stream.Collectors.toMap(s -> s.substring(0, 1), s -> s));", "给 toMap 增加合并函数，例如 `(a, b) -> a.length() >= b.length() ? a : b`。", "两个元素都映射到键 a，缺少重复键处理策略。", "合并函数参数顺序对应已有值与新值。", "设计 Map 汇总前先确认键是否唯一。"),
  debug("怎样让这个无初始值求和在空流时也返回 0？", "int total = values.stream().mapToInt(Integer::intValue).reduce((a, b) -> a + b).getAsInt();", "使用 `sum()`，或给 reduce 提供 identity：`.reduce(0, Integer::sum)`。", "空流的无初始值 reduce 返回空 OptionalInt，直接取值会抛异常。", "在访问 Optional 前处理空值路径。", "存在自然单位元时，用带 identity 的归约表达空输入结果。"),
]);

add("advanced", "泛型", "函数式接口与 Optional", [
  quiz("single", "一个普通函数式接口最多可以有几个抽象方法？", ["一个；Object 的公共方法签名不计为额外抽象方法。", "任意多个，只要有 default 方法。", "必须为零个。", "必须正好两个。"], [0], "函数式接口只有一个函数描述符，可通过 @FunctionalInterface 请求编译器检查。", "它仍可以有 default、static 或 Object 方法签名。", "把单一行为契约交给 lambda 表达。"),
  quiz("single", "`Optional.map(f)` 中 f 返回 null 时通常怎样处理？", ["结果成为 Optional.empty()。", "Optional 直接保存 null。", "抛出 NullPointerException。", "自动创建空字符串。"], [0], "若 Optional 有值，map 会将映射结果包装；结果为 null 时转为空 Optional。", "Optional 本身不允许表示“有值且为 null”。", "对返回 Optional 的函数使用 flatMap 避免嵌套。"),
  quiz("multiple", "关于 Optional，哪些说法正确？", ["`orElse` 的参数表达式会先被求值。", "`orElseGet` 可在值缺失时延迟调用 supplier。", "`Optional.of(null)` 返回 empty。", "`Optional.ofNullable(null)` 返回 empty。"], [0, 1, 3], "orElse 会预先计算参数；orElseGet 按需调用；ofNullable 可接收 null。", "Optional.of(null) 会抛 NullPointerException。", "默认值计算昂贵或有副作用时使用 orElseGet。"),
  quiz("multiple", "关于 lambda，哪些描述正确？", ["lambda 需要目标函数式接口类型。", "lambda 读取的局部变量需为 final 或 effectively final。", "lambda 总是创建一个新线程。", "方法引用可简写某些直接转发参数的 lambda。"], [0, 1, 3], "lambda 通过目标类型确定函数签名，捕获局部变量要求不再重新赋值。", "lambda 描述行为，不会自动启动线程。", "区分行为对象、执行线程和执行时机。"),
  output("输出什么？", "java.util.Optional<String> name = java.util.Optional.of(\"Ada\");\nSystem.out.println(name.map(String::toUpperCase).orElse(\"N/A\"));", "ADA", "Optional 有值时执行 map，将字符串转换为大写；orElse 返回该值。", "map 不会修改原字符串。", "使用 Optional 管理可缺失值时保持链式转换明确。"),
  output("supplier 会执行几次？", "int value = java.util.Optional.of(7).orElseGet(() -> { System.out.println(\"fallback\"); return 0; });\nSystem.out.println(value);", "7", "Optional 已有值，因此 supplier 不执行，只输出 7。", "orElseGet 的 supplier 仅在空 Optional 时调用。", "懒加载默认值时可用 orElseGet。"),
  output("输出哪一个值？", "java.util.function.Function<String, Integer> length = String::length;\nSystem.out.println(length.apply(\"Java\"));", "4", "String::length 是接收 String 并返回 int 的实例方法引用，自动装箱为 Integer。", "方法引用仍需符合目标函数式接口的参数和返回类型。", "先写出函数参数与结果类型，再判断能否引用方法。"),
  debug("为什么捕获的 count 无法编译？", "int count = 0;\nRunnable task = () -> System.out.println(count);\ncount++;", "移除后续对 count 的重新赋值，或先把值复制到一个不会再变更的局部变量。", "被 lambda 捕获的局部变量必须 final 或 effectively final。", "局部变量捕获并不会自动形成可变闭包单元。", "把需要共享的可变状态放到明确的对象或并发容器中。"),
  debug("为什么 Optional.of 这一行抛出异常？应按可空输入怎样包装？", "String value = null;\nvar wrapped = java.util.Optional.of(value);", "将 `of` 改为 `Optional.ofNullable(value)`。", "Optional.of 要求参数非 null。", "若 null 表示程序错误，of 的异常也可能是有意校验。", "明确区分禁止 null 和允许缺失两种契约。"),
]);

add("advanced", "集合", "Comparator 与有序数据", [
  quiz("single", "Comparator 的 `compare(a, b)` 返回负数通常意味着什么？", ["a 在排序顺序中排在 b 前面。", "a 与 b 必须是同一对象。", "a 必须为空。", "比较结果只允许是 -1、0、1。"], [0], "Comparator 只规定负、零、正的意义，不要求返回值恰为 -1、0、1。", "比较器应满足一致性与传递性。", "将排序关系读成负、零、正，而不是精确数字。"),
  quiz("single", "要按分数降序、同分时按姓名升序，通常怎样组合比较器？", ["先比较分数的降序比较器，再 thenComparing 姓名升序。", "先按姓名降序，再按分数升序。", "把两个比较器用逻辑或连接。", "对分数调用 hashCode 排序。"], [0], "主键排序为 score reversed，随后以姓名升序作为次级键。", "反转整个组合与只反转主比较器可能得到不同顺序。", "先明确主排序方向，再追加稳定的次级比较键。"),
  quiz("multiple", "构造 Comparator 时哪些做法合理？", ["`Comparator.comparing(Person::name)` 按名称比较。", "`thenComparingInt(Person::age)` 添加整数次级排序。", "用 `a.age - b.age` 比较可能发生整数溢出。", "Comparator 必须修改被排序对象才能排序。"], [0, 1, 2], "comparing 与 thenComparing 组合键；减法比较可能溢出，应改用 Integer.compare。", "排序比较器通常只描述次序，不应修改对象。", "使用 compare / comparing API 避免减法溢出。"),
  quiz("multiple", "关于排序，哪些说法正确？", ["List.sort 可原地排序列表。", "Stream.sorted 生成排序后的流结果，不会原地重排源 List。", "比较器若对不等价关系自相矛盾，排序可能失败或结果不可靠。", "HashMap 的 keySet 天然按键排序。"], [0, 1, 2], "List.sort 修改列表顺序；Stream.sorted 处理流水线；比较器应维持传递一致性。", "HashMap 不提供排序保证。", "排序契约是比较函数需要遵循的逻辑，而非仅提供任意数字。"),
  output("排序后的数字列表是什么？", "var values = new java.util.ArrayList<>(java.util.List.of(9, 2, 5));\nvalues.sort(java.util.Comparator.naturalOrder());\nSystem.out.println(values);", "[2, 5, 9]", "naturalOrder 按整数自然升序排列列表本身。", "List.sort 会修改这个列表。", "需要保留原顺序时先复制或用 Stream.sorted。"),
  output("下面姓名的排序顺序是什么？", "var names = java.util.List.of(\"Bob\", \"Al\", \"Eve\").stream()\n    .sorted(java.util.Comparator.comparingInt(String::length).thenComparing(java.util.Comparator.naturalOrder())).toList();\nSystem.out.println(names);", "[Al, Bob, Eve]", "先按长度升序，再对同长度姓名按自然字母顺序比较。", "次级比较器只在主要键相等时生效。", "复合排序时明确每一级键的顺序与方向。"),
  output("结果列表是什么？", "var values = java.util.List.of(3, 1, 2).stream()\n    .sorted(java.util.Comparator.reverseOrder()).toList();\nSystem.out.println(values);", "[3, 2, 1]", "reverseOrder 按整数自然顺序的反向排列。", "Comparator.reverseOrder 需要元素类型实现 Comparable。", "使用反向比较器表达降序而不是手写不对称比较。"),
  debug("如何避免年龄相减导致的比较溢出？", "people.sort((a, b) -> a.age - b.age);", "改为 `people.sort(Comparator.comparingInt(Person::age))` 或 `Integer.compare(a.age, b.age)`。", "当年龄值接近 int 极值时，减法可能溢出并破坏排序关系。", "错误比较器可能违反传递性并造成不可预测排序。", "不要用相减作为通用数值比较。"),
  debug("为什么姓名相同时无法按年龄排列？怎样加入第二排序键？", "people.sort(java.util.Comparator.comparing(Person::name));", "追加 `.thenComparingInt(Person::age)`。", "现有比较器只看 name，同名对象比较结果为 0。", "排序稳定时同键元素会维持原相对顺序，但这不等于按年龄排序。", "将每个业务排序条件都写入比较器组合。"),
]);

add("advanced", "IO", "文件路径与字符编码", [
  quiz("single", "读取文本文件时显式指定 UTF-8 的好处是什么？", ["避免依赖运行环境默认字符集，跨环境解释一致。", "让所有文件都变成二进制格式。", "自动去除文件中的换行。", "保证文件一定存在。"], [0], "明确字符集使字节到字符的解码规则稳定。", "编码选择不能替代文件存在性与权限检查。", "文本 IO 在边界处明确指定 charset。"),
  quiz("single", "`Path.resolve(\"child.txt\")` 通常用于什么？", ["在路径对象基础上解析一个子路径。", "马上读取文件所有内容。", "删除目标目录。", "检查用户是否有写权限。"], [0], "resolve 组合路径片段并返回 Path，不执行文件读写。", "路径拼接与 IO 操作是分离步骤。", "构造 Path 后仍需检查或调用相应文件 API。"),
  quiz("multiple", "关于 Files 的文本 API，哪些说法正确？", ["`Files.readString(path, UTF_8)` 返回文件全部文本。", "`Files.writeString` 可将文本写入路径。", "文件不存在时 readString 会返回空字符串。", "文件 IO 可能抛出 IOException。"], [0, 1, 3], "readString / writeString 是文本便利 API，读取失败会以 IO 异常报告。", "不存在与空文件是两种不同状态。", "调用处应声明或处理受检 IO 异常。"),
  quiz("multiple", "关于 Path 与文件操作，哪些说法正确？", ["Path 本身是路径表示，不一定对应存在的文件。", "`Files.exists(path)` 可检查路径当前是否存在，但结果会随时间变化。", "`resolve` 总会规范化并消除所有 `..`。", "使用 try-with-resources 管理打开的 Reader。"], [0, 1, 3], "Path 只描述位置；exists 是瞬时检查，打开 reader 后需关闭资源。", "文件系统在检查和使用之间可能变化；resolve 也不保证执行规范化。", "用实际 IO 操作处理竞态，并妥善管理资源。"),
  output("UTF-8 编码后这个字符占多少字节？", "byte[] bytes = \"猫\".getBytes(java.nio.charset.StandardCharsets.UTF_8);\nSystem.out.println(bytes.length);", "3", "猫的 UTF-8 编码由三个字节组成。", "String.length 计算 UTF-16 代码单元数，与编码后的字节数不同。", "网络与文件长度应根据具体字符编码计算。"),
  output("这个路径的文件名部分是什么？", "var path = java.nio.file.Path.of(\"data\").resolve(\"users.csv\");\nSystem.out.println(path.getFileName());", "users.csv", "resolve 组合父路径和子路径，getFileName 返回最后一个路径部分。", "Path 的展示分隔符因平台不同；文件名部分不变。", "用 Path 的结构化方法查询路径片段。"),
  output("解码后输出什么？", "byte[] bytes = \"Java\".getBytes(java.nio.charset.StandardCharsets.UTF_8);\nSystem.out.println(new String(bytes, java.nio.charset.StandardCharsets.UTF_8));", "Java", "使用相同字符集将字节序列解码，还原原字符串。", "用不匹配的字符集解码可能产生乱码。", "编码与解码边界保持字符集一致。"),
  debug("为什么这个代码在文件不存在时没有拿到空文本？", "String text = java.nio.file.Files.readString(java.nio.file.Path.of(\"missing.txt\"));", "捕获或声明 IOException，并根据业务需求创建文件、返回缺失状态或提示用户。", "readString 对不存在的路径抛出 IOException 子类，不会自动返回空字符串。", "不要把“缺失”误当成“内容长度为零”。", "让文件缺失成为显式、可处理的业务结果。"),
  debug("怎样避免 Writer 在异常路径上泄漏？", "var writer = java.nio.file.Files.newBufferedWriter(path);\nwriter.write(text);", "用 `try (var writer = Files.newBufferedWriter(path)) { writer.write(text); }`。", "当前代码没有关闭 writer；缓冲内容或文件描述符可能无法及时释放。", "close 也可能抛出 IOException，因此应纳入结构化清理。", "用 try-with-resources 管理 AutoCloseable IO 资源。"),
]);

add("internals", "JVM 内存", "栈、堆与对象引用", [
  quiz("single", "调用一个方法时，通常哪类数据随该次调用创建并随返回而结束？", ["该调用的栈帧与局部变量。", "所有堆对象。", "整个类的元数据。", "所有线程的栈。"], [0], "每次方法调用创建栈帧，保存局部变量表、操作数栈等；返回时该帧退出。", "局部变量中的引用消失，不代表引用对象一定立刻回收。", "区分线程栈帧和堆中对象的生命周期。"),
  quiz("single", "一个对象不再能从任何 GC Root 到达，通常意味着什么？", ["它符合被垃圾回收的条件，但回收时间不确定。", "它必须在下一条语句前销毁。", "JVM 会立即调用对象析构器。", "它会自动写入磁盘。"], [0], "不可达对象可被垃圾回收器回收，但何时回收没有保证。", "Java 不提供确定时刻的析构语义。", "不要把对象不可达和内存立即释放等同。"),
  quiz("multiple", "关于 JVM 内存区域，哪些说法较准确？", ["每个线程拥有自己的 Java 虚拟机栈。", "对象通常分配在堆中。", "程序计数器在所有线程间共享一份。", "类元数据通常由方法区相关运行时区域承载。"], [0, 1, 3], "栈与程序计数器具有线程私有属性；堆和类元数据区域由线程共享。", "具体实现可采用不同物理布局，规范描述的是运行时数据区域语义。", "避免把 JVM 规范区域与某一实现的物理内存布局混为一谈。"),
  quiz("multiple", "关于对象引用与可达性，哪些描述正确？", ["一个对象可以被多个引用指向。", "局部引用变量离开作用域后，其引用值不再从该变量读取。", "GC 必须按 Java 变量名从短到长回收。", "对象仍被静态集合强引用时通常保持可达。"], [0, 1, 3], "对象可共享引用；GC 根据可达性判断，而不是变量名称或词法顺序。", "JIT 还可能提前判定局部变量不再存活。", "检查根引用链，而不是寻找对象创建时的变量名。"),
  output("程序输出什么？", "int x = 3;\nint y = x;\ny = 9;\nSystem.out.println(x + \":\" + y);", "3:9", "基本类型赋值复制数值；重写 y 不影响 x。", "基本类型和引用类型赋值的对象关系不同。", "先确认变量保存值还是引用。"),
  output("会打印什么？", "class Box { int value; }\nBox a = new Box();\nBox b = a;\nb.value = 6;\nSystem.out.println(a.value);", "6", "两个局部变量指向同一个堆对象，通过 b 修改的字段也可由 a 看到。", "局部引用在栈帧中，对象状态通常位于堆中。", "对象别名共享状态，需要考虑封装。"),
  output("代码最后输出什么？", "class Node { Node next; }\nNode first = new Node();\nNode second = new Node();\nfirst.next = second;\nfirst = null;\nSystem.out.println(second != null);", "true", "second 仍直接引用第二个 Node；清空 first 不会清掉 second 引用。", "对象是否可达要看所有引用路径。", "多个引用可以让对象在某个引用消失后仍保持可达。"),
  debug("为什么在方法返回后不能再使用方法内的局部变量？", "static void run() {\n    int local = 3;\n}\nSystem.out.println(local);", "把要在调用后使用的值作为返回值返回，或声明在合适的外部作用域。", "local 只在 run 方法作用域内可见，方法返回时其栈帧退出。", "作用域是语言规则，不能通过堆栈模型绕过。", "通过参数和返回值显式传递方法数据。"),
  debug("为什么清空这个引用后，对象仍可能不能回收？", "static Object retained;\nObject value = new Object();\nretained = value;\nvalue = null;", "同时清除 `retained` 或移除持有它的集合条目；确认不存在其他强引用路径。", "静态字段 retained 仍然指向对象，使其从 GC Root 可达。", "只清除一个局部别名不能证明对象不可达。", "沿着静态字段、线程栈和集合引用追踪可达路径。"),
]);

add("internals", "类加载", "加载、初始化与反射", [
  quiz("single", "主动使用一个类时，类初始化通常先后按什么顺序进行？", ["先初始化父类，再初始化子类。", "先初始化子类，再初始化父类。", "按字段名称字母序。", "所有类在 JVM 启动时同时初始化。"], [0], "类初始化会保证父类先于子类；接口相关细节则需按具体初始化规则分析。", "类加载、链接与初始化是不同阶段。", "阅读静态初始化输出时，沿父子关系追踪。"),
  quiz("single", "`Class.forName(\"example.Widget\")` 的常见效果是什么？", ["加载并初始化该类（默认使用当前调用方类加载器）。", "只生成源码文件。", "实例化一个 Widget 对象。", "自动调用 Widget 的所有实例方法。"], [0], "常见单参数 Class.forName 会加载并初始化目标类。", "得到 Class 对象不等于创建实例。", "需要仅加载而不初始化时，使用带 initialize 参数的重载。"),
  quiz("multiple", "类加载器双亲委派模型通常有哪些目的？", ["优先让父加载器尝试加载类。", "降低核心 API 被用户类重复定义替换的风险。", "保证所有类只能由启动类加载器加载。", "应用仍可通过自定义加载器扩展加载策略。"], [0, 1, 3], "双亲委派有助于类身份与核心类安全，同时不排除自定义加载器。", "不同类加载器可以定义不同的同名类。", "类身份由二进制名称和定义它的加载器共同决定。"),
  quiz("multiple", "关于反射和 Class 对象，哪些描述正确？", ["`obj.getClass()` 返回对象运行时类的 Class 对象。", "反射可以检查类型成员并在权限允许时调用方法。", "同名类即便由不同类加载器定义，也必然是相同运行时类型。", "反射 API 操作失败可能抛出受检或运行时异常。"], [0, 1, 3], "Class 提供运行时类型信息；反射能动态操作成员并受访问控制影响。", "定义加载器不同可能使同名二进制类成为不同类型。", "使用反射时应处理成员不存在、访问受限和目标调用异常。"),
  output("静态初始化的打印顺序是什么？", "class Base { static { System.out.print(\"B\"); } }\nclass Child extends Base { static { System.out.print(\"C\"); } }\nClass<?> type = Child.class;\nnew Child();", "BC", "取 Child.class 字面量不会触发初始化；new Child 时先初始化 Base，再初始化 Child。", "获取类字面量与主动初始化不是同一操作。", "区分类信息解析与类初始化触发点。"),
  output("通过父类引用查看的运行时类名是什么？", "class Parent {}\nclass Child extends Parent {}\nParent item = new Child();\nSystem.out.println(item.getClass().getSimpleName());", "Child", "getClass 返回对象运行时类型，而非变量声明类型。", "静态类型影响编译期成员检查。", "用 getClass 观察对象的实际类型。"),
  output("静态初始化块执行几次？", "class Cache { static int loads; static { loads++; } }\nnew Cache(); new Cache();\nSystem.out.println(Cache.loads);", "1", "类初始化对同一 Class 对象通常只执行一次；后续对象共享已初始化的类状态。", "每个对象构造不会重新执行静态初始化。", "类初始化和实例初始化是两个阶段。"),
  debug("为什么静态字段读取时出现初始化错误？", "class Config { static int PORT = Integer.parseInt(System.getenv(\"PORT\")); }", "检查环境变量是否设置为合法整数，并在静态初始化中处理或避免外部配置失败。", "类主动使用会触发静态字段初始化；解析失败可抛 NumberFormatException，并使类初始化失败。", "类初始化失败会影响该 Class 后续主动使用。", "避免把不可靠外部输入解析放进不可恢复的静态初始化路径。"),
  debug("反射代码为什么找不到构造器？", "var ctor = type.getConstructor(String.class);\nObject value = ctor.newInstance(\"x\");", "确认类确有 public String 构造器；否则使用 `getDeclaredConstructor(String.class)` 并按访问规则处理。", "getConstructor 只查找 public 构造器，不包括非 public 声明。", "获取声明成员和执行访问还受模块及访问控制影响。", "选择符合成员可见性范围的反射 API。"),
]);

add("internals", "JVM 内存", "GC 可达性与引用", [
  quiz("single", "Java 垃圾回收器主要依据什么判断对象是否可回收？", ["从 GC Roots 出发是否仍有可达路径。", "对象最后一次创建的时间。", "对象的 hashCode 是否为 0。", "程序员是否调用过 System.gc。"], [0], "主流追踪式 GC 根据对象从根集合是否可达判断存活。", "System.gc 只是请求，不保证立刻或必然执行回收。", "对象生命周期取决于引用图，而非手动析构调用。"),
  quiz("single", "SoftReference 与 WeakReference 的一般区别是什么？", ["软引用通常在内存压力下才可能被清除，弱引用对象在下一次相关 GC 时即可被清除。", "两者都保证对象永不回收。", "弱引用比强引用更强。", "软引用对象必须放在栈上。"], [0], "两种特殊引用强度不同；软引用常用于内存敏感缓存，弱引用更容易被清除。", "具体回收时机仍由运行时决定。", "缓存正确性不应依赖引用对象一定存活多久。"),
  quiz("multiple", "关于 Java 对象回收，哪些说法正确？", ["不可达表示对象符合回收条件，不代表立即回收。", "finalize 提供可靠、确定时机的资源释放。", "try-with-resources 适合确定性关闭文件资源。", "循环引用的对象只要整个环不可达，仍可被追踪式 GC 回收。"], [0, 2, 3], "追踪式 GC 能回收不可达循环；文件等资源应使用确定性的 close 结构。", "finalize 已被弃用方向所取代且不可靠，不能用于资源生命周期保证。", "用 AutoCloseable 和 try-with-resources 管理外部资源。"),
  quiz("multiple", "哪些对象通常可能作为 GC Root 或根集合来源？", ["当前活动线程栈中可达的引用。", "类静态字段引用。", "JNI 句柄引用。", "任何已不可达对象的自身引用。"], [0, 1, 2], "活动栈、静态字段和 JNI 引用等可构成根集合来源。", "不可达对象内部的环不能凭自身恢复外部可达性。", "沿根到对象的引用路径判断存活。"),
  output("这段代码运行后是否能访问到 value？", "Object value = new Object();\nObject alias = value;\nvalue = null;\nSystem.out.println(alias != null);", "true", "alias 仍指向对象，因此局部变量引用仍可访问该对象。", "清除一个变量不等于对象无引用。", "检查是否有其他别名保持引用。"),
  output("输出是什么？", "var reference = new java.lang.ref.WeakReference<>(new Object());\nSystem.out.println(reference.get() == null);", "不确定：GC 时机未指定", "临时对象没有其他强引用，但 GC 是否已运行以及何时运行没有保证。", "在无压力的短程序中结果也可能受调度影响。", "不要把弱引用清除时机写成确定性业务结果。"),
  output("显式调用 gc 后对象一定已被回收吗？", "Object value = new Object();\nvalue = null;\nSystem.gc();", "不保证", "System.gc 是向运行时提出回收建议，不保证立即执行，也不保证某个对象一定被回收。", "System.gc 不是同步销毁 API。", "正确程序不依赖手动触发 GC 的时间。"),
  debug("为什么这段缓存不能保证对象在需要时还存在？", "var cache = new java.util.WeakHashMap<Object, String>();\nObject key = new Object();\ncache.put(key, \"value\");\nkey = null;", "若缓存值必须保留映射，应采用强引用键或其他明确生命周期策略；不要依赖 WeakHashMap 保留键。", "弱键在没有其他强引用后可被 GC 清除，映射可能随之移除。", "弱引用缓存具有非确定性存活时间。", "先定义缓存过期策略，再选择强引用或特殊引用。"),
  debug("为什么用 finalize 关闭文件可能造成资源泄漏？", "class ReaderOwner {\n    protected void finalize() { closeFile(); }\n}", "让对象实现 AutoCloseable，并由调用方用 try-with-resources 显式关闭。", "finalize 调用时间不确定，甚至可能在进程结束前都不执行。", "垃圾回收与外部资源关闭是不同生命周期。", "对文件、socket 等资源使用确定性释放机制。"),
]);

add("internals", "并发基础", "Java 内存模型与原子性", [
  quiz("single", "把字段声明为 volatile，能够保证什么？", ["读写可见性与相关的内存顺序约束，但不保证复合操作原子。", "所有线程自动互斥执行。", "所有对象方法变成 synchronized。", "线程永远不会被中断。"], [0], "volatile 建立特定的可见性和顺序保证，但 `count++` 仍由读、改、写组成。", "可见性与原子性是不同性质。", "共享计数通常使用 synchronized 或原子类。"),
  quiz("single", "线程调用 `worker.join()` 正常返回后，主线程可以依赖什么？", ["worker 已经终止，且 worker 中的动作 happens-before join 返回后的动作。", "worker 还未开始执行。", "主线程一定已经被中断。", "所有其他 JVM 线程也都终止了。"], [0], "join 等待指定线程结束，并建立线程终止与成功 join 后动作之间的 happens-before。", "join 只等待指定线程，不会停止进程中的其他线程。", "用 join 建立清晰的线程完成和结果读取边界。"),
  quiz("multiple", "关于共享计数器，哪些方案能保证并发递增不丢失更新？", ["对读改写全过程使用同一把 synchronized 锁。", "使用 AtomicInteger.incrementAndGet。", "只将 int 字段声明为 volatile。", "线程各自写入无同步的共享 `count++`。"], [0, 1], "同步临界区或原子类提供不可分割的递增操作。", "volatile 不会把复合读改写合成为一个原子动作。", "将原子性要求落实到完整操作，而非单个字段读写。"),
  quiz("multiple", "哪些操作通常会建立 happens-before 关系？", ["同一线程内程序顺序中的前序动作先于后续动作。", "线程对 volatile 字段的写先于后续对该字段的读。", "线程 A 调用 start 先于新线程中的动作。", "任意两个线程同时读取同一普通 int。"], [0, 1, 2], "程序顺序、volatile 同步关系和 start 关系均由内存模型定义。", "普通变量的并发读本身不会建立线程间顺序关系。", "用明确同步边连接共享状态的写入与读取。"),
  output("join 后会打印什么？", "class Box { int value; }\nBox box = new Box();\nThread t = new Thread(() -> box.value = 7);\nt.start();\nt.join();\nSystem.out.println(box.value);", "7", "worker 在结束前写入 7，join 返回保证其先行动作对主线程可见。", "若没有 start/join 或其他同步关系，普通字段并发访问可能不可见。", "通过线程完成协议安全发布结果。"),
  output("原子计数最终是多少？", "var count = new java.util.concurrent.atomic.AtomicInteger(0);\ncount.incrementAndGet();\ncount.addAndGet(4);\nSystem.out.println(count.get());", "5", "原子值从 0 加 1，再加 4，结果为 5。", "原子类只保护其定义的原子操作；复合业务逻辑仍需设计同步。", "把共享计数封装到专门的原子类型中。"),
  output("执行后打印的布尔值是什么？", "var ready = new java.util.concurrent.atomic.AtomicBoolean(false);\nready.set(true);\nSystem.out.println(ready.get());", "true", "同线程先写 true 再读取，因此得到 true；AtomicBoolean 还支持跨线程原子读写。", "这个顺序题本身不展示竞争条件。", "原子类既提供原子性，也提供相应可见性语义。"),
  debug("为什么 volatile counter 仍可能少计？", "volatile int counter;\nvoid increment() { counter++; }", "改用 `AtomicInteger.incrementAndGet()`，或在整个 increment 方法/临界区加同步。", "counter++ 先读值、计算新值再写回，多个线程的步骤可能交错覆盖。", "volatile 只保证字段访问语义，不保证复合更新原子。", "把不可分割操作作为一个同步单位保护。"),
  debug("线程启动后为什么不能直接假设结果已写好？怎样等待它完成？", "Thread worker = new Thread(() -> result = compute());\nworker.start();\nSystem.out.println(result);", "在读取前调用 `worker.join()`，并处理 InterruptedException。", "start 只启动异步执行，不等待 run 完成。", "调度顺序不是固定的。", "用 join、Future.get 等完成同步而非依赖休眠时间。"),
]);

add("internals", "锁与线程池", "锁、Executor 与并发容器", [
  quiz("single", "使用显式 `ReentrantLock` 时，最重要的释放习惯是什么？", ["在 finally 中 unlock，确保异常路径也释放。", "每次 lock 后等待一秒。", "只有线程成功时才 unlock。", "不需要调用 unlock，GC 会释放。"], [0], "锁获取后应在 finally 中释放，避免异常路径使其他线程永久等待。", "ReentrantLock 不会因为对象被 GC 而自动替业务释放。", "把 lock 与 try/finally 配对。"),
  quiz("single", "调用 ExecutorService.shutdown() 通常表示什么？", ["不再接受新任务，并让已提交任务继续完成。", "立刻中断所有正在执行的任务。", "删除所有队列中的任务。", "只关闭当前调用线程。"], [0], "shutdown 发出有序关闭请求：停止接收新任务，处理已提交任务。", "shutdownNow 的语义更偏向尝试中断与返回未启动任务。", "按所需关闭语义选择 shutdown 或 shutdownNow。"),
  quiz("multiple", "关于线程池和 Future，哪些说法正确？", ["submit 可返回 Future 供调用方取结果或状态。", "Future.get 通常会等待任务完成。", "调用 shutdown 后立即提交新任务仍必然成功。", "线程池可避免为每个短任务反复创建线程。"], [0, 1, 3], "Future 表示异步结果；get 等待完成，线程池复用工作线程。", "shutdown 后新任务会被拒绝。", "管理好池的生命周期并处理拒绝、取消与异常。"),
  quiz("multiple", "关于锁和并发容器，哪些说法正确？", ["ConcurrentHashMap 不允许 null 键和值。", "在 finally 调用 unlock 可防止异常路径泄漏锁。", "锁获取和释放可建立可见性关系。", "把所有变量都声明 volatile 就等价于互斥锁。"], [0, 1, 2], "ConcurrentHashMap 禁止 null；锁提供互斥与内存可见性语义。", "volatile 不提供互斥，也不能保护跨字段不变量。", "根据共享状态操作选择锁、原子类或并发容器。"),
  output("执行两次原子更新后打印什么？", "var count = new java.util.concurrent.atomic.AtomicInteger();\ncount.updateAndGet(n -> n + 2);\ncount.updateAndGet(n -> n * 3);\nSystem.out.println(count.get());", "6", "默认初值为 0；先加 2 得 2，再乘 3 得 6。", "updateAndGet 的变换按调用顺序作用于当前原子值。", "复杂更新可用原子更新函数表达，但应保持函数无副作用。"),
  output("两次更新后结果是多少？", "var map = new java.util.concurrent.ConcurrentHashMap<String, Integer>();\nmap.merge(\"hits\", 1, Integer::sum);\nmap.merge(\"hits\", 1, Integer::sum);\nSystem.out.println(map.get(\"hits\"));", "2", "两次 merge 对 hits 累加，最终为 2。", "ConcurrentHashMap 不接受 null 键或 null 值。", "对并发计数映射优先考虑原子 Map 操作。"),
  output("tryLock 成功后会打印什么？", "var lock = new java.util.concurrent.locks.ReentrantLock();\nboolean acquired = lock.tryLock();\ntry { System.out.println(acquired); } finally { if (acquired) lock.unlock(); }", "true", "当前线程持有新建且未被占用的锁，tryLock 返回 true。", "只有成功获得锁的线程才能 unlock。", "tryLock 分支需要处理获取失败时的替代路径。"),
  debug("为什么线程池关闭后这次提交会被拒绝？", "var pool = java.util.concurrent.Executors.newSingleThreadExecutor();\npool.shutdown();\npool.submit(() -> work());", "把所有任务先提交，再调用 shutdown；或为新一批任务创建/获取仍开放的 Executor。", "shutdown 后 Executor 不再接受新任务。", "shutdown 是生命周期状态转换，不是暂停。", "先确定任务生产结束，再关闭执行器并等待完成。"),
  debug("为什么异常发生时其他线程仍拿不到这把锁？", "lock.lock();\nwork();\nlock.unlock();", "改用 `lock.lock(); try { work(); } finally { lock.unlock(); }`。", "work 抛异常时控制流跳过 unlock，锁被当前线程持有。", "显式 Lock 没有自动 try/finally 语法糖。", "每次成功 lock 都确保存在 finally 解锁路径。"),
]);

add("comprehensive", "综合应用", "订单汇总与集合建模", [
  quiz("single", "汇总订单金额时，金额字段与数量相乘后再累计，优先选择什么类型存放总额？", ["long，并在乘法前保证至少一个操作数按 long 运算。", "byte，因为单个订单通常较小。", "boolean，因为只需要判断是否有金额。", "char，因为金额是非负整数。"], [0], "多个订单金额相加可能超过 int；若乘法先以 int 发生溢出，之后转 long 也无法恢复。", "扩大总额变量不一定改变右侧中间表达式的类型。", "从乘法操作数开始使用 long，并检查金额单位与溢出边界。"),
  quiz("single", "按商品 SKU 累计订单行数量，哪种结构最直接？", ["Map<String, Long>，SKU 作键、累计数量作值。", "Set<Long>，只保存所有行数。", "Stack<String>，把 SKU 当作调用栈。", "用数组下标直接当 SKU 字符串。"], [0], "Map 将业务键映射到累计值，适合计数与汇总。", "若使用 Integer 汇总，也要评估总量是否可能超过范围。", "根据访问方式选用最合适的数据结构。"),
  quiz("multiple", "实现可靠订单汇总时，哪些做法有帮助？", ["为金额、数量和总额选择足够宽的数值类型。", "用不可变订单记录表达已校验的订单行。", "对每一行无条件吞掉解析异常并继续，不记录错误。", "对重复 SKU 使用 merge 或明确的累加逻辑。"], [0, 1, 3], "可靠汇总需要范围适当的类型、清楚的数据模型和重复键聚合策略。", "吞异常会让部分失败被误认为成功汇总。", "输入校验与聚合逻辑都应保留可解释的失败信息。"),
  quiz("multiple", "关于汇总管道，哪些检查可减少结果错误？", ["确认空输入时的返回值。", "检查重复键由覆盖、求和还是拒绝处理。", "确认金额舍入规则与币种精度。", "依赖 HashMap 的迭代顺序生成报表。"], [0, 1, 2], "空输入、冲突键和货币精度都是汇总的业务规则。", "HashMap 没有排序承诺。", "把报表顺序作为显式排序步骤。"),
  output("SKU A 汇总数量是多少？", "record Line(String sku, int quantity) {}\nvar lines = java.util.List.of(new Line(\"A\", 2), new Line(\"B\", 3), new Line(\"A\", 4));\nvar totals = new java.util.HashMap<String, Integer>();\nfor (var line : lines) totals.merge(line.sku(), line.quantity(), Integer::sum);\nSystem.out.println(totals.get(\"A\"));", "6", "SKU A 的数量由两行组成，merge 将 2 与 4 累加。", "相同 SKU 是同一个 Map 键，需要累计而不是覆盖。", "将重复键策略编码进 merge 函数。"),
  output("这份报表按 SKU 字母序输出什么？", "var totals = new java.util.TreeMap<String, Integer>();\ntotals.put(\"B\", 5); totals.put(\"A\", 6);\nSystem.out.println(totals);", "{A=6, B=5}", "TreeMap 按键自然字典序遍历，A 排在 B 前面。", "排序由 Map 类型决定，不取决于 put 顺序。", "输出顺序需要稳定时选择有序结构或显式排序。"),
  output("long total 的最终值是多少？", "long total = 0;\nint price = 1_500_000_000;\nint quantity = 2;\ntotal += (long) price * quantity;\nSystem.out.println(total);", "3000000000", "把 price 在乘法前转换为 long，因此乘法以 long 执行，结果为 3000000000。", "若写成 `(long) (price * quantity)`，int 乘法会先溢出。", "溢出保护要放在计算发生之前。"),
  debug("为什么汇总金额会在转换成 long 后仍是负数？", "long total = 0;\nint price = 1_500_000_000;\nint quantity = 2;\ntotal += price * quantity;", "改为 `total += (long) price * quantity;`，使乘法本身以 long 执行。", "price * quantity 先以 int 计算并溢出，再扩大为 long。", "左侧 long 目标不会反向扩大右侧表达式。", "在易溢出的中间计算开始前提升操作数类型。"),
  debug("为什么重复 SKU 没有累加？怎样保留之前的数量？", "totals.put(line.sku(), line.quantity());", "使用 `totals.merge(line.sku(), line.quantity(), Integer::sum)`，或读取旧值后显式相加。", "put 会直接覆盖该键当前值。", "Map 的键唯一，累加需要业务明确的合并函数。", "先定义重复记录策略，再选择 put 或 merge。"),
]);

add("comprehensive", "算法思路", "复杂度与边界条件", [
  quiz("single", "对已排序数组做二分查找，典型时间复杂度是多少？", ["O(log n)。", "O(n²)。", "O(1) 对任意数组都成立。", "O(n log n) 每次查找。"], [0], "每轮将候选范围缩小约一半，比较次数随 log₂ n 增长。", "二分查找依赖输入按相同比较规则有序。", "先检查排序前提，再使用二分查找。"),
  quiz("single", "对空数组执行下标遍历时，最安全的循环条件通常是什么？", ["`i < values.length`。", "`i <= values.length`。", "`i == values.length`。", "`i > 0`。"], [0], "长度为 0 时，i 从 0 开始即不满足 i < length，因此循环体不会执行。", "`<=` 会在非空数组末尾访问下标 length。", "用左闭右开的区间表达遍历边界。"),
  quiz("multiple", "设计二分查找时，哪些约定要保持一致？", ["区间端点是否包含。", "mid 计算及左右边界更新规则。", "数组比较顺序与排序时采用的规则。", "找到元素后随意把 high 设为数组长度。"], [0, 1, 2], "闭区间或左闭右开区间都可行，但边界更新必须与约定配套。", "不一致更新会造成漏检或死循环。", "逐轮证明候选区间缩小且保留可能解。"),
  quiz("multiple", "关于算法复杂度，哪些说法正确？", ["遍历 n 个元素一次通常是 O(n)。", "两层各遍历 n 次的嵌套循环通常是 O(n²)。", "常数因子会保留在大 O 表达式中。", "每次把规模减半的循环通常是 O(log n)。"], [0, 1, 3], "大 O 描述渐进增长，忽略常数倍；循环次数可按规模关系估算。", "输入分布、最坏情况或均摊口径需按题目说明。", "从输入规模变化与操作次数关系推导复杂度。"),
  output("下面算法返回的下标是多少？", "int[] values = {1, 3, 5, 7, 9};\nint index = java.util.Arrays.binarySearch(values, 7);\nSystem.out.println(index);", "3", "数组升序且 7 位于下标 3，binarySearch 返回该下标。", "元素不存在时返回值是负编码，不是普通的 -1。", "理解具体搜索 API 的未命中返回契约。"),
  output("循环后 sum 是多少？", "int[] values = {2, 2, 3};\nint sum = 0;\nfor (int value : values) sum += value;\nSystem.out.println(sum);", "7", "对数组三个元素逐个累计，2 + 2 + 3 = 7。", "求和保留重复元素，不等同于 Set 去重后求和。", "先确认题目要求的是逐项累计还是按键去重。"),
  output("该实现返回的最大值是多少？", "int[] values = {-4, -2, -9};\nint best = values[0];\nfor (int value : values) if (value > best) best = value;\nSystem.out.println(best);", "-2", "best 从数组中的真实元素 -4 初始化，遍历后更新为 -2。", "最大值初始为 0 会错误处理全负数输入。", "使用首元素作初值，或明确处理空集合。"),
  debug("为什么数组包含重复值时结果计数不正确？", "int distinct = 0;\nfor (int i = 0; i < values.length; i++) distinct++;", "使用 Set 存放已见元素并返回其大小，或在排序后只统计与前一项不同的值。", "现有循环统计的是元素个数，重复元素也各计一次。", "区分输入项计数与不同值计数。", "先把需求定义成唯一元素数，再选择去重策略。"),
  debug("为什么对空数组读取 values[0] 会失败？", "int max = values[0];", "先检查数组非空；为空时返回 OptionalInt.empty、抛出明确异常或采用业务定义的默认结果。", "长度为 0 时不存在下标 0。", "最大值问题对空输入需要显式定义语义。", "数组访问前验证边界条件。"),
]);

add("comprehensive", "综合应用", "异常处理与服务边界", [
  quiz("single", "服务层捕获异常后，最不利于排错的做法是什么？", ["吞掉异常并返回看似成功的默认值，不记录原因。", "添加上下文后保留 cause 再抛出。", "把可恢复的输入错误转换为明确业务结果。", "在边界处记录一次失败并向调用方反馈。"], [0], "静默吞异常会把失败伪装成正常结果，让调用方无法判断数据是否完整。", "异常处理要么恢复，要么转换并保留因果信息。", "让失败状态与成功结果在接口上可区分。"),
  quiz("single", "当方法需要返回“有值或没有值”，且缺失是正常业务状态时，哪种结果表达更清晰？", ["Optional<T> 或显式结果类型。", "返回 null 且不写文档。", "返回任意特殊负数作为所有类型的缺失值。", "捕获所有异常后返回对象的 toString。"], [0], "显式结果类型让调用方处理缺失分支。", "null 可用但需要稳定的契约与防护。", "将正常缺失和异常失败区分开。"),
  quiz("multiple", "生产级文件导入流程中，哪些做法有助于数据可靠？", ["显式指定字符集。", "资源用 try-with-resources 关闭。", "校验每条输入并报告行号。", "遇到格式错误就静默跳过且仍报告全部导入成功。"], [0, 1, 2], "编码、资源管理和逐条校验能让输入过程可重现且可诊断。", "静默跳过会让结果与输入内容不一致。", "定义失败时回滚、部分接受或报告错误的业务策略。"),
  quiz("multiple", "关于并发服务的共享状态，哪些设计较稳妥？", ["使用线程安全的并发容器或在临界区同步。", "明确对象的所有权与可变状态边界。", "共享 ArrayList 的多线程 add 一定安全。", "把读取、校验和更新不变量作为整体原子操作。"], [0, 1, 3], "安全共享需要线程安全容器、明确所有权，并保护跨字段不变量。", "单个容器的线程安全也不自动使多步业务事务原子。", "根据业务不变量的范围设计同步边界。"),
  output("构造器验证失败后捕获的消息是什么？", "try {\n    java.util.Objects.requireNonNull(null, \"name\");\n} catch (NullPointerException ex) {\n    System.out.println(ex.getMessage());\n}", "name", "requireNonNull 收到 null 时抛 NullPointerException，并将 name 作为消息。", "验证失败应在边界尽早显现。", "给参数校验异常提供能定位字段的消息。"),
  output("关闭前后打印顺序是什么？", "var log = new StringBuilder();\ntry (var resource = new AutoCloseable() { public void close() { log.append(\"C\"); } }) { log.append(\"W\"); }\nSystem.out.println(log);", "WC", "try 主体追加 W，离开 try 时 close 追加 C。", "资源关闭发生在控制流离开 try-with-resources 主体时。", "把资源生命周期和主体操作放入同一结构。"),
  output("程序输出什么？", "var result = java.util.Optional.ofNullable(\"\")\n    .filter(s -> !s.isBlank()).orElse(\"fallback\");\nSystem.out.println(result);", "fallback", "Optional 有空字符串，但 filter 因其 blank 丢弃值，orElse 返回 fallback。", "Optional.ofNullable 只检查 null，不会自动过滤空字符串。", "把 null、空串和空白串策略分别写清楚。"),
  debug("为什么 catch 之后调用方仍以为导入成功？怎样表达失败？", "try { importFile(path); } catch (IOException ignored) { }\nreturn ImportResult.success();", "在异常时返回失败结果或带错误详情的结果；必要时保留异常 cause 并记录上下文。", "异常被忽略后仍无条件返回 success，失败被伪装为成功。", "不要用空 catch 隐藏数据导入失败。", "让 API 的结果状态真实反映操作结果。"),
  debug("为什么这个共享计数在多线程下可能少于任务总数？", "class Stats { int completed; void done() { completed++; } }", "用 AtomicInteger.incrementAndGet，或把 done 方法同步并通过同步读取结果。", "普通 ++ 是读改写复合操作，多个线程可能覆盖彼此结果。", "字段可见性与递增原子性需要分别满足。", "把并发更新封装为原子操作。"),
]);

const pilotCounts = { beginner: 6, foundation: 8, advanced: 8, internals: 5, comprehensive: 3 };
const fullCounts = { beginner: 60, foundation: 80, advanced: 80, internals: 50, comprehensive: 30 };
const typeCounts = Object.fromEntries(["single", "multiple", "output", "debug"].map((type) => [type, 0]));
let bankSize = 0;
const preparedBanks = [];

for (const stage of stages) {
  const filePath = path.join(root, "src/data/questions", stage.file);
  const existing = JSON.parse(await readFile(filePath, "utf8"));
  if (![pilotCounts[stage.id], fullCounts[stage.id]].includes(existing.length)) {
    throw new Error(`${stage.id}: 题库应处于 ${pilotCounts[stage.id]} 题试点或 ${fullCounts[stage.id]} 题完整状态，实际有 ${existing.length} 道。`);
  }
  const pilot = existing.slice(0, pilotCounts[stage.id]);

  const generated = additions[stage.id];
  const expectedAdditions = fullCounts[stage.id] - pilotCounts[stage.id];
  if (generated.length !== expectedAdditions) {
    const distribution = Object.fromEntries(Object.keys(typeCounts).map((type) => [type, generated.filter((question) => question.type === type).length]));
    throw new Error(`${stage.id}: 需要新增 ${expectedAdditions} 题，当前 ${generated.length} 题，题型分布 ${JSON.stringify(distribution)}。`);
  }

  const questions = [...pilot, ...generated].map((question, index) => ({
    id: `${stage.prefix}-${String(index + 1).padStart(3, "0")}`,
    stage: stage.id,
    ...question,
  }));
  const fingerprints = new Set();
  for (const question of questions) {
    const fingerprint = `${question.stem.trim()}\u0000${question.code?.trim() ?? ""}`;
    if (fingerprints.has(fingerprint)) throw new Error(`${question.id}: 同阶段存在题干与代码完全重复的题目。`);
    fingerprints.add(fingerprint);
    typeCounts[question.type] += 1;
  }

  preparedBanks.push([filePath, questions]);
  bankSize += questions.length;
  console.log(`${stage.id}: ${pilot.length} + ${generated.length} = ${questions.length}`);
}

if (bankSize !== Object.values(fullCounts).reduce((sum, count) => sum + count, 0)) {
  throw new Error(`题库总量应为 300，实际为 ${bankSize}。`);
}
for (const [type, count] of Object.entries(typeCounts)) {
  if (count === 0) throw new Error(`题库缺少 ${type} 题。`);
}

for (const [filePath, questions] of preparedBanks) {
  await writeFile(filePath, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
}

console.log(`已生成 ${bankSize} 题。题型分布：${JSON.stringify(typeCounts)}`);
