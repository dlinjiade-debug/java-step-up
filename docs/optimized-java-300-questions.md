# Java 阶梯题库 · 300 题完整修订版

## 入门 · 60 题

### 变量与类型

#### J01-001 · 单选 · 基础

这段代码为什么无法通过编译？

```java
byte count = 1;
count = count + 1;
```

A. byte 不能保存整数
B. count + 1 的结果是 int，不能直接赋给 byte
C. 局部变量不能再次赋值
D. 加法只能用于 long

**参考答案：** B

**解析：** byte、short 和 char 参与算术运算时会先提升为 int，因此右侧表达式的类型是 int。赋值给 byte 需要显式窄化转换，或改用复合赋值。

- A：byte 可以保存 -128 到 127 的整数。
- B：正确：二元数值提升使 count + 1 的类型为 int。
- C：普通局部变量允许多次赋值。
- D：加法可以用于多种数值类型。

**易错点：** 不要只看变量 count 的声明类型来推断整个表达式的类型。

**知识小结：** 先判断表达式类型，再检查赋值是否需要显式转换。

### 运算符

#### J01-002 · 代码输出 · 基础

程序会输出什么？

```java
System.out.println(7 / 2);
```

**参考答案**

```text
3
```

**解析：** 两个操作数都是 int，整数除法会舍弃小数部分，因此 7 / 2 的结果是 3。

**易错点：** 整数除法不会自动得到 3.5。

**知识小结：** 想保留小数，至少让一个操作数使用浮点类型，例如 7.0 / 2。

#### J01-003 · 代码输出 · 巩固

下面代码最后输出什么？

```java
int count = 0;
boolean ok = count++ > 0 && count++ > 0;
System.out.println(count);
```

**参考答案**

```text
1
```

**解析：** 第一次比较使用旧值 0，随后 count 自增为 1，比较结果为 false。&& 左侧为 false 时会短路，右侧的 count++ 不执行，所以最终输出 1。

**易错点：** 后置自增表达式参与比较时先使用旧值，再完成自增。

**知识小结：** && 和 || 会根据左侧结果决定是否计算右侧。

### 流程控制

#### J01-004 · 代码输出 · 基础

下面循环结束后 sum 的值是多少？

```java
int sum = 0;
for (int i = 1; i <= 3; i++) {
    sum += i;
}
System.out.println(sum);
```

**参考答案**

```text
6
```

**解析：** 循环依次把 1、2、3 加入 sum，计算过程是 0 + 1 + 2 + 3，结果为 6。

**易错点：** 注意循环条件是 i <= 3，因此 i 等于 3 时仍会执行一次。

**知识小结：** 跟踪循环题时逐轮记录变量，比凭直觉判断更可靠。

### 数组

#### J01-005 · 代码纠错 · 巩固

这段遍历代码在最后一次循环时会抛出什么问题？应怎样修正循环条件？

```java
int[] values = {4, 8, 12};
for (int i = 0; i <= values.length; i++) {
    System.out.println(values[i]);
}
```

**参考答案：** 数组下标最大为 values.length - 1。i 等于 values.length 时越界，应将条件改为 i < values.length。

**解析：** 长度为 3 的数组合法下标是 0、1、2。条件 i <= values.length 会让 i 取到 3，访问 values[3] 时抛出 ArrayIndexOutOfBoundsException。

**易错点：** 数组长度表示元素个数，不是最后一个下标。

**知识小结：** 按下标遍历数组时通常使用 i < array.length。

### 方法

#### J01-006 · 单选 · 巩固

调用 change 后，调用方的变量 n 是多少？

```java
static void change(int value) {
    value = 9;
}
int n = 3;
change(n);
```

A. 3
B. 9
C. 0
D. 无法编译

**参考答案：** A

**解析：** Java 将 n 的值复制给形参 value。方法内重写的是副本，不会改变调用方的 n。

- A：正确：调用方变量仍保存 3。
- B：9 只会成为方法内 value 的值。
- C：int 局部变量不会自动归零，且此处已初始化为 3。
- D：方法签名和调用本身合法。

**易错点：** 传递对象引用时也是传值：复制的是引用值，重新给形参赋引用不会替换调用方引用。

**知识小结：** Java 方法参数始终按值传递。

### 变量与类型

#### J01-007 · 单选 · 基础

关于 Java 的基本整数类型，哪项说法正确？

A. byte 的取值范围是 -128 到 127
B. short 与 int 占用的位数相同
C. long 字面量默认不需要后缀 L
D. char 是带符号的 16 位整数

**参考答案：** A

**解析：** byte 是 8 位有符号整数，最大值为 127。

- A：byte 使用 8 位有符号表示，范围为 -128 到 127。
- B：short 为 16 位，int 为 32 位。
- C：整数字面量默认按 int 处理，超出范围或希望按 long 运算时应写 L。
- D：char 是 16 位无符号 UTF-16 代码单元。

**易错点：** 不要把每种类型的位数和范围混为一谈。

**知识小结：** 记住基本整数类型的宽度：byte 8、short 16、int 32、long 64。

#### J01-008 · 单选 · 基础

执行 `double x = 5 / 2;` 后，x 的值是什么？

A. 2.5
B. 2.0
C. 2
D. 编译失败

**参考答案：** B

**解析：** 先以 int 执行 `5 / 2` 得到 2，再扩大转换为 2.0。

- A：赋值目标类型不会让已经执行的整数除法改成浮点除法。
- B：5 和 2 都是 int，除法先得到 2，再将结果扩大为 double。
- C：变量的存储类型是 double，输出或读取时会表现为 2.0。
- D：int 可以自动扩大转换为 double。

**易错点：** 浮点变量不会反向改变右侧表达式的运算类型。

**知识小结：** 想得到 2.5，应写 `5.0 / 2` 或进行显式转换。

#### J01-009 · 多选 · 基础

以下哪些赋值不需要显式窄化转换？

A. `long n = 12;`
B. `double d = 3.5f;`
C. `int n = 12L;`
D. `byte b = 128;`

**参考答案：** A、B

**解析：** int 可以扩大为 long，float 可以扩大为 double；反方向转换可能损失信息。

- A：int 到 long 是安全的扩大转换。
- B：float 到 double 是扩大浮点转换。
- C：long 到 int 可能丢失高位，需要显式转换。
- D：128 超出 byte 范围，常量也无法通过赋值范围检查。

**易错点：** 字面量后缀会改变其类型，进而影响是否能赋值。

**知识小结：** 先判定表达式的静态类型，再判断转换方向与取值范围。

#### J01-010 · 多选 · 巩固

以下关于 `char` 与数值运算的说法哪些正确？

A. `char` 可以保存 `中` 这样的 UTF-16 代码单元
B. `char` 可以直接保存任意 Unicode 码点
C. `'A' + 1` 的结果仍然是 char
D. `'A' + 1` 的表达式类型是 int

**参考答案：** A、D

**解析：** char 是 UTF-16 代码单元；参加算术运算时会提升为 int。

- A：char 的范围覆盖 0 到 65535，包含该代码单元。
- B：补充平面字符需要一对 UTF-16 代码单元，单个 char 不能容纳。
- C：运算时提升为 int，结果类型为 int。
- D：char 参与二元算术前会进行一元数值提升。

**易错点：** 代码单元与 Unicode 码点不是同一个概念。

**知识小结：** 处理完整 Unicode 文本时，使用 `String` 或码点 API。

#### J01-011 · 代码输出 · 基础

程序将输出什么？

```java
long n = 3_000_000_000L;
System.out.println(n / 2);
```

**参考答案**

```text
1500000000
```

**解析：** L 后缀使字面量为 long，因此除法按 long 运算，结果为 1500000000。

**易错点：** 不要遗漏超出 int 范围的字面量后缀。

**知识小结：** 数字分隔符不改变数值，只提升可读性。

#### J01-012 · 代码输出 · 基础

两行输出依次是什么？

```java
System.out.println(9 / 4);
System.out.println(9 % 4);
```

**参考答案**

```text
2
1
```

**解析：** 整数除法取商 2，余数运算得到 1，并满足 9 = 2 × 4 + 1。

**易错点：** `/` 与 `%` 是两个不同运算符。

**知识小结：** 用商和余数可以拆分整数单位。

#### J01-013 · 代码输出 · 基础

下面代码输出什么？

```java
char letter = 'A';
System.out.println(letter + 2);
```

**参考答案**

```text
67
```

**解析：** `letter` 以数值 65 参与 int 运算，结果是 67。

**易错点：** 字符参与算术后，结果通常不再是 char。

**知识小结：** 需要字符时，可显式转换并确认结果仍在 char 范围内。

#### J01-014 · 代码纠错 · 巩固

这段代码无法编译，应该怎样改？

```java
int count = 4_000_000_000;
System.out.println(count);
```

**参考答案：** 将 count 声明为 long，并把字面量写为 4_000_000_000L。

**解析：** 该整数字面量超过 int 上限；应让字面量和接收变量都使用 long。

**易错点：** 只改变量声明仍不够，字面量本身也必须能被解析为 long。

**知识小结：** 处理大整数时，从字面量开始检查类型。

#### J01-015 · 代码纠错 · 巩固

如何保留 7 除以 2 的小数部分？

```java
double quotient = 7 / 2;
System.out.println(quotient);
```

**参考答案：** 改为 `double quotient = 7.0 / 2;`，或先把至少一个操作数转换为 double。

**解析：** 原表达式先进行 int 除法，得到 3，再赋值为 3.0。

**易错点：** 把结果变量改为 double 不会改变已发生的整数除法。

**知识小结：** 至少一个操作数必须是浮点类型。

### 运算符

#### J01-016 · 单选 · 基础

已定义返回 boolean 的 `check()` 方法。求值 `true || check()` 时会调用它吗？

A. 会，|| 总会计算两侧
B. 只有 check 返回 false 才会执行
C. 不会，|| 左侧为 true 时会短路
D. 代码无法编译

**参考答案：** C

**解析：** `||` 的左侧已为 true，结果必为 true，右侧会跳过。

- A：总是计算两侧的是按位或 `|`，不是短路逻辑或 `||`。
- B：右侧未执行时，不存在返回值。
- C：逻辑或左侧已经为 true，右侧不影响结果，因此不再求值。
- D：只要 check 返回 boolean，该表达式就合法。

**易错点：** 单个 `|` 和双竖线 `||` 的求值行为不同。

**知识小结：** 短路运算可用于安全地延后右侧判断。

#### J01-017 · 单选 · 基础

表达式 `2 + 3 * 4` 的值是多少？

A. 20
B. 24
C. 语法错误
D. 14

**参考答案：** D

**解析：** 乘法优先级高于加法：2 + (3 × 4) = 14。

- A：从左到右直接计算会忽略运算符优先级。
- B：加法也参与表达式，不能只计算乘法部分。
- C：该算术表达式语法有效。
- D：乘法优先于加法，先算 3 × 4，再加 2。

**易错点：** 不要仅按书写顺序从左向右计算不同优先级的运算符。

**知识小结：** 复杂表达式可以增加括号表达预期分组。

#### J01-018 · 多选 · 基础

已定义返回 boolean 的 `check()` 方法。以下哪些表达式会跳过对 `check()` 的调用？

A. `false & check()`
B. `true | check()`
C. `false && check()`
D. `true || check()`

**参考答案：** C、D

**解析：** 逻辑 `&&` 与 `||` 会依据左侧值省略无需执行的右侧。

- A：boolean 的单个 `&` 会计算左右两侧。
- B：boolean 的单个 `|` 不会短路。
- C：&& 左侧为 false，结果已确定。
- D：|| 左侧为 true，结果已确定。

**易错点：** 按位 `&`、`|` 用于 boolean 时仍会计算两边。

**知识小结：** 当右侧含副作用或可能空指针时，短路顺序很重要。

#### J01-019 · 多选 · 基础

以下哪些结果为 true？

A. `!(2 == 2)`
B. `!false`
C. `3 > 2 && 1 == 1`
D. `2 < 1 || 4 < 3`

**参考答案：** B、C

**解析：** 前两项分别是逻辑非 true，以及两个 true 条件的逻辑与。

- A：括号中相等比较为 true，取反后为 false。
- B：逻辑非将 false 取反为 true。
- C：两个比较都为 true，逻辑与结果为 true。
- D：两个条件都为 false，逻辑或为 false。

**易错点：** `!` 会反转括号中完整表达式的布尔结果。

**知识小结：** 可把较复杂布尔式分成子条件逐一求值。

#### J01-020 · 代码输出 · 巩固

最后输出多少？

```java
int x = 5;
System.out.println(x++ + ++x);
```

**参考答案**

```text
12
```

**解析：** 后置自增先取 5 再变 6；前置自增变为 7 并取 7，和为 12。

**易错点：** 同一表达式中连续修改变量容易造成阅读错误。

**知识小结：** 理解前后置语义后，实际代码优先拆成多行。

#### J01-021 · 代码输出 · 巩固

程序输出什么？

```java
int x = 1;
boolean result = x++ > 1 && ++x > 1;
System.out.println(x + ":" + result);
```

**参考答案**

```text
2:false
```

**解析：** 左侧比较使用旧值 1，随后 x 变为 2；条件为 false 使 && 短路，所以右侧不执行。

**易错点：** 短路会阻止右侧的自增副作用。

**知识小结：** 先计算左操作数及其副作用，再决定是否计算右侧。

#### J01-022 · 代码输出 · 巩固

两行输出依次是什么？

```java
int a = 2;
System.out.println(a > 1 || ++a > 2);
System.out.println(a);
```

**参考答案**

```text
true
2
```

**解析：** 第一个比较为 true，|| 跳过右侧；a 保持 2。

**易错点：** 不要假定逻辑运算一定会执行全部操作数。

**知识小结：** 用副作用追踪题检查短路分支。

#### J01-023 · 代码纠错 · 巩固

下面的判断可能因空引用抛出异常，怎样安全地改写？

```java
if (name.length() > 0 && name != null) {
    System.out.println(name);
}
```

**参考答案：** 把 `name != null` 移到 `name.length()` 前面：`name != null && name.length() > 0`。

**解析：** 左侧会先执行，name 为空时访问 length 会抛 NullPointerException。

**易错点：** `&&` 的求值顺序固定为从左到右。

**知识小结：** 将空值守卫放在可能解引用的表达式之前。

#### J01-024 · 代码纠错 · 巩固

这段布尔判断为什么没有短路保护？如何避免每次都调用 expensiveCheck？

```java
boolean valid = input != null & expensiveCheck(input);
```

**参考答案：** 使用 `&&`：`boolean valid = input != null && expensiveCheck(input);`。

**解析：** 单个 `&` 对 boolean 运算不会短路，右侧始终执行。

**易错点：** `&` 有位运算和逻辑非短路用途，不能当作 `&&` 的拼写变体。

**知识小结：** 控制流程需要短路时，使用 `&&` 或 `||`。

### 流程控制

#### J01-025 · 单选 · 基础

`do...while` 与 `while` 的关键区别是什么？

A. do...while 至少执行一次循环体
B. while 一定比 do...while 多执行一次
C. 两者只能遍历数组
D. do...while 不能使用 boolean 条件

**参考答案：** A

**解析：** do...while 在循环体之后检查条件，所以第一次执行不受条件真假影响。

**易错点：** while 与 do...while 的判断位置不同。

**知识小结：** 需要先执行一次再决定是否重复时使用 do...while。

#### J01-026 · 单选 · 基础

传统冒号式 switch 分支没有 break、return 或 throw 时，执行完匹配分支后会怎样？

A. 重新判断下一个 case
B. 继续执行后续分支语句，直到遇到跳出语句或 switch 结束
C. 编译器总会插入 break
D. 自动跳到 switch 末尾

**参考答案：** B

**解析：** 传统冒号式 case 在匹配后会发生贯穿执行（fall-through）。

**易错点：** 不要把传统 switch 和使用箭头标签的 switch 写法混为一谈。

**知识小结：** 在传统 case 中明确写 break，或使用无贯穿的箭头标签。

#### J01-027 · 多选 · 基础

以下哪些写法可用于退出循环？

A. `return;` 总是只结束当前一轮循环
B. 执行 `continue;` 立即退出整个循环
C. 循环条件变为 false 后自然结束
D. 在循环体中执行 `break;`

**参考答案：** C、D

**解析：** break 直接结束当前循环；条件不成立时循环也会自然结束。

**易错点：** continue 结束当前轮并进入下一轮，不会退出循环。

**知识小结：** 区分 break、continue 与 return 各自控制的范围。

#### J01-028 · 多选 · 基础

以下关于 `for` 循环的说法哪些正确？

A. 初始化表达式通常执行一次
B. continue 会跳过本轮的更新表达式
C. 条件省略时等价于条件为 false
D. 每轮循环体后会执行更新表达式，再检查条件

**参考答案：** A、D

**解析：** 普通 for 循环先初始化，然后反复检查条件、执行循环体和更新表达式。

**易错点：** continue 在 for 循环中仍会进入更新步骤。

**知识小结：** 画出初始化、条件、循环体、更新的执行顺序。

#### J01-029 · 代码输出 · 基础

循环完成后输出什么？

```java
int i = 0;
while (i < 3) {
    i++;
}
System.out.println(i);
```

**参考答案**

```text
3
```

**解析：** i 依次变为 1、2、3；当 i 等于 3 时条件为 false。

**易错点：** 条件是 `< 3`，所以值为 3 时不会再进入循环。

**知识小结：** 退出循环时变量可能已经等于边界值。

#### J01-030 · 代码输出 · 基础

程序输出什么？

```java
int sum = 0;
for (int i = 1; i <= 4; i += 2) sum += i;
System.out.println(sum);
```

**参考答案**

```text
4
```

**解析：** i 依次为 1 和 3，sum 最终为 1 + 3 = 4。

**易错点：** 更新表达式每轮增加 2，不是增加 1。

**知识小结：** 列出每轮循环变量，比只看边界更可靠。

#### J01-031 · 代码输出 · 基础

下面代码输出什么？

```java
int n = 5;
do { n -= 2; } while (n > 10);
System.out.println(n);
```

**参考答案**

```text
3
```

**解析：** do...while 先执行一次循环体，n 从 5 变为 3，之后条件为 false。

**易错点：** 即使首轮条件最终为 false，do...while 也已执行。

**知识小结：** 判断循环类型时先找到条件检查发生的位置。

#### J01-032 · 代码纠错 · 巩固

忽略外部中断和输出异常时，为什么这个循环不会自行结束？如何修复？

```java
int i = 0;
while (i < 5) {
    System.out.println(i);
}
```

**参考答案：** 在循环体中增加 `i++`，使 i 最终达到 5 并让条件为 false。

**解析：** 循环体没有修改 i，条件一直为 true。

**易错点：** 循环变量必须沿着能够终止循环的方向更新。

**知识小结：** 检查循环体是否会改变条件所依赖的状态。

#### J01-033 · 代码纠错 · 巩固

如何让这个 switch 只打印一个匹配结果？

```java
switch (code) {
    case 1: System.out.println("one");
    case 2: System.out.println("two");
    default: System.out.println("other");
}
```

**参考答案：** 在各个传统 case 末尾添加 `break`，或将 case 改为箭头标签。

**解析：** 传统 switch 匹配后会继续执行后续标签的语句。

**易错点：** default 也会在发生贯穿时执行。

**知识小结：** 为传统 case 写出清晰的结束方式，避免意外贯穿。

### 数组

#### J01-034 · 单选 · 基础

`int[] a = new int[3];` 创建后，三个元素的初始值是什么？

A. 没有初始值，读取时必然编译失败
B. 第一个为 0，其余为 null
C. 都是 0
D. 都是 null

**参考答案：** C

**解析：** 数组元素会获得其类型的默认值；int 元素默认为 0。

**易错点：** 局部变量必须显式初始化，数组元素则会自动初始化。

**知识小结：** 区分局部变量和对象字段、数组元素的默认值规则。

#### J01-035 · 单选 · 基础

数组长度为 5 时，最后一个合法下标是多少？

A. 1
B. 由数组内容决定
C. 5
D. 4

**参考答案：** D

**解析：** 数组下标从 0 开始，最后一个下标是 length - 1。

**易错点：** length 表示元素个数，不表示最大下标。

**知识小结：** 遍历条件通常写为 `i < array.length`。

#### J01-036 · 多选 · 基础

以下哪些操作不会直接修改数组 `source` 的元素？

A. `int[] copy = source.clone();` 后改 `copy[0]`
B. `int[] copy = source;` 后改 `copy[0]`
C. 调用 `Arrays.sort(source)`
D. 把 `source[1]` 赋给一个 int 变量再修改该变量

**参考答案：** A、D

**解析：** clone 会创建新数组；把 int 元素赋给局部变量则复制其数值。

**易错点：** 赋值数组引用只复制引用，并未复制底层数组。

**知识小结：** 检查修改作用于引用、数组本身，还是元素值的副本。

#### J01-037 · 多选 · 基础

关于增强 for 循环，哪些说法正确？

A. 给循环变量重新赋值不会替换原集合中的元素
B. 循环变量是数组下标
C. 适合依次读取数组或 Iterable 中的元素
D. 遍历时可以安全地删除当前 ArrayList 元素而不影响迭代

**参考答案：** A、C

**解析：** 增强 for 把当前元素值或引用赋给循环变量；变量不是下标。

**易错点：** 对 ArrayList 做结构性修改仍可能触发迭代器的并发修改检测。

**知识小结：** 需要下标时用传统 for；需要安全删除时使用 Iterator.remove。

#### J01-038 · 代码输出 · 基础

输出什么？

```java
int[] values = {2, 4, 6};
values[1] = values[0] + values[2];
System.out.println(values[1]);
```

**参考答案**

```text
8
```

**解析：** 索引 1 被赋值为索引 0 与索引 2 的和，即 2 + 6。

**易错点：** 数组赋值会更新指定元素，不会自动重排其他元素。

**知识小结：** 先用花括号列出下标和值，有助于跟踪数组变化。

#### J01-039 · 代码输出 · 基础

程序会输出什么？

```java
int[] a = {3, 1};
int[] b = a;
b[0] = 9;
System.out.println(a[0]);
```

**参考答案**

```text
9
```

**解析：** a 和 b 保存同一个数组对象的引用，修改 b[0] 也能通过 a 观察到。

**易错点：** 数组变量存储的是引用，不是数组元素的副本。

**知识小结：** 需要独立数组时调用 clone 或复制工具。

#### J01-040 · 代码输出 · 基础

打印的行数是多少？

```java
String[] names = {"A", "B", "C"};
int count = 0;
for (String name : names) count++;
System.out.println(count);
```

**参考答案**

```text
3
```

**解析：** 增强 for 对三个数组元素各执行一次循环体。

**易错点：** 循环变量 name 并不是数组下标。

**知识小结：** 用增强 for 遍历时，迭代次数等于元素数。

#### J01-041 · 代码纠错 · 巩固

下面的复制结果仍会随原数组变化，怎样获得独立副本？

```java
int[] source = {2, 4, 6};
int[] copy = source;
```

**参考答案：** 使用 `int[] copy = source.clone();`，或使用 `Arrays.copyOf(source, source.length)`。

**解析：** 数组赋值只复制引用，因此 source 与 copy 指向同一数组。

**易错点：** 新变量名并不意味着新数组对象。

**知识小结：** 区分浅拷贝数组引用和新建数组。

#### J01-042 · 代码纠错 · 巩固

二维数组每一行长度不同，为什么遍历第二行时会越界？

```java
int[][] rows = {{1, 2}, {3}};
for (int row = 0; row < rows.length; row++) {
    for (int col = 0; col < rows[0].length; col++) {
        System.out.println(rows[row][col]);
    }
}
```

**参考答案：** 内层循环应使用当前行的长度：`col < rows[row].length`。

**解析：** 第二行仅有一个元素，使用第一行长度会访问 rows[1][1]。

**易错点：** Java 的二维数组可以是不规则数组，每一行的长度可不同。

**知识小结：** 遍历第 row 行时，用 `rows[row].length` 作为列边界。

### 方法

#### J01-043 · 单选 · 基础

方法 `replace(int[] values) { values = new int[]{9}; }` 接收 `int[] a = {1}` 后，调用 `replace(a)`，`a[0]` 是多少？

A. 1；重新赋值只改变方法内形参的指向
B. 编译失败；数组不能作为方法参数
C. 9；方法能改写调用方变量 a 的指向
D. 0；数组元素会被重置

**参考答案：** A

**解析：** 传入的是数组引用值的副本，给形参重新赋值不改变调用方变量 a。

**易错点：** 重新绑定形参与通过引用修改同一数组元素是两回事。

**知识小结：** 追踪每个引用变量当前指向哪个数组对象。

#### J01-044 · 单选 · 基础

方法声明返回类型为 `void`，以下哪种写法符合它的用途？

A. 不能出现 return 语句
B. 可以执行 `return;` 结束方法，但不返回值
C. 必须返回 null
D. 必须返回 0

**参考答案：** B

**解析：** void 表示方法不向调用者提供返回值；return 可用于提前结束。

**易错点：** void 不是一个需要返回的值类型。

**知识小结：** 用 return 结束控制流，不要附带表达式。

#### J01-045 · 多选 · 巩固

以下关于方法重载的说法哪些正确？

A. 同名方法可以通过不同参数列表构成重载
B. 只改变返回类型不能构成重载
C. 形参名不同就一定构成重载
D. 调用时编译器根据实参选择适用的方法

**参考答案：** A、B、D

**解析：** 重载由方法名与参数列表区分，调用解析会考虑实参和适用转换。

**易错点：** 返回类型和形参名称不属于区分重载的充分条件。

**知识小结：** 检查参数个数、类型和顺序，而不是只比较名字。

#### J01-046 · 多选 · 巩固

下列哪些描述符合 Java 参数传递？

A. 对象引用作为一个值复制到形参
B. 方法给形参重新赋一个对象不会让调用方引用改指向
C. 把对象传入方法后，方法永远不能修改对象状态
D. 基本类型实参的值复制到形参

**参考答案：** A、B、D

**解析：** 形参收到实参值的副本；对象状态仍可通过复制的引用修改。

**易错点：** 引用值的复制和对象本身的复制不是一回事。

**知识小结：** 先问方法是重绑引用，还是修改共享对象。

#### J01-047 · 代码输出 · 基础

程序输出什么？

```java
static int twice(int x) { return x * 2; }
int n = 4;
System.out.println(twice(n));
```

**参考答案**

```text
8
```

**解析：** 方法得到 4，返回 4 × 2 的结果 8。

**易错点：** return 的值由方法签名决定。

**知识小结：** 调用方可以把表达式结果直接用于输出或赋值。

#### J01-048 · 代码输出 · 基础

执行后输出什么？

```java
static void reset(int value) { value = 0; }
int score = 6;
reset(score);
System.out.println(score);
```

**参考答案**

```text
6
```

**解析：** 形参 value 是 score 当前值的副本，赋值不会改变 score。

**易错点：** 方法调用不会自动把参数中的新值写回调用方。

**知识小结：** 需要更新调用方变量时，让方法返回新值并接收它。

#### J01-049 · 代码输出 · 巩固

输出哪一个重载结果？

```java
static String pick(long n) { return "long"; }
static String pick(double n) { return "double"; }
System.out.println(pick(4));
```

**参考答案**

```text
long
```

**解析：** int 实参可以扩大到 long 或 double，两者中 long 是更具体的适用选择。

**易错点：** 重载在编译期按静态类型与最适用转换解析。

**知识小结：** 同时出现多个重载时，逐一比较方法调用转换。

#### J01-050 · 代码纠错 · 巩固

为什么这段方法无法通过编译？如何让所有执行路径都有返回值？

```java
static int sign(int n) {
    if (n >= 0) return 1;
}
```

**参考答案：** 为 n < 0 的路径补上返回值，例如在 if 之后写 `return -1;`。

**解析：** 返回类型为 int 的方法必须保证每条可能路径都返回 int。

**易错点：** 局部看来常见的输入不等于编译器可证明的所有路径。

**知识小结：** 逐条检查条件分支是否覆盖全部执行路径。

#### J01-051 · 代码纠错 · 巩固

如何让 `add(1, 2)` 仍可编译，并让 `add(1, 2, 3)` 求和？

```java
static int add(int a, int b) {
    return a + b;
}
```

**参考答案：** 增加 `static int add(int a, int b, int c)` 重载，或将方法改为接收 `int... values` 并遍历求和。

**解析：** 现有签名只接受两个 int 实参。

**易错点：** 变参在调用点可接收零个或多个同类型实参，但仍需定义如何汇总。

**知识小结：** 按不同参数列表重载，或用变参表达数量可变的输入。

### 字符串

#### J01-052 · 单选 · 基础

Java `String` 对象的典型特性是什么？

A. 不能用 `equals` 比较内容
B. 可变：每次调用 concat 都改写原对象
C. 不可变：拼接会得到新字符串
D. 只能保存 ASCII 字符

**参考答案：** C

**解析：** String 不可变，字符串内容变化会产生另一个 String 值。

**易错点：** 引用变量可重新赋值，但这不等于原 String 对象被改写。

**知识小结：** 大量循环拼接可考虑 StringBuilder。

#### J01-053 · 单选 · 基础

已知非 null 的两个 String 变量 a、b，比较其文本内容是否相同应使用什么？

A. 比较两个对象的 hashCode
B. `a == b`
C. `a.compareTo(b) == 1`
D. `a.equals(b)`

**参考答案：** D

**解析：** equals 用于比较字符串内容；== 判断是否为同一对象引用。

**易错点：** 字符串常量池可能让部分相同字面量引用相同对象，不能据此依赖 == 比较内容。

**知识小结：** 若接收者可能为 null，可使用 Objects.equals(a, b)。

#### J01-054 · 多选 · 基础

关于字符串拼接，哪些说法正确？

A. `String` 的 `concat` 会原地改变接收者
B. 在循环里反复拼接大量字符串可能产生额外对象
C. `StringBuilder.append` 会修改 builder 并返回 builder
D. `String` 拼接表达式会产生字符串结果

**参考答案：** B、C、D

**解析：** StringBuilder 适合可变式追加；String 表达式得到新字符串结果。

**易错点：** 不可变性意味着 concat 不会改变原字符串。

**知识小结：** 小规模拼接可直接使用 +；大量迭代拼接时考虑 builder。

#### J01-055 · 多选 · 基础

以下关于局部变量与字段的说法哪些正确？

A. 实例字段在对象构造时有默认值
B. 局部变量使用前必须先明确赋值
C. 对象的 int 字段默认值为 0
D. 未赋值的局部 int 变量会自动设为 0

**参考答案：** A、B、C

**解析：** 字段在初始化阶段会得到默认值；局部变量必须先被赋值才能读取。

**易错点：** 字段默认值规则不适用于未初始化的局部变量。

**知识小结：** 看到变量时先判断它是字段还是局部变量。

#### J01-056 · 代码输出 · 基础

输出什么？

```java
String word = "java";
word.toUpperCase();
System.out.println(word);
```

**参考答案**

```text
java
```

**解析：** toUpperCase 返回新字符串，但结果未保存，因此 word 仍引用原值。

**易错点：** String 的方法不会就地修改内容。

**知识小结：** 接收并保存不可变对象方法返回的新值。

#### J01-057 · 代码输出 · 基础

下面输出什么？

```java
String a = new String("hi");
String b = new String("hi");
System.out.println((a == b) + ":" + a.equals(b));
```

**参考答案**

```text
false:true
```

**解析：** new 创建了两个不同对象，== 为 false；它们内容相同，equals 为 true。

**易错点：** 对象身份与对象内容是两个不同判断。

**知识小结：** 引用身份比较用 ==，内容相等比较用 equals。

#### J01-058 · 代码输出 · 基础

拼接后的长度是多少？

```java
StringBuilder text = new StringBuilder("Java");
text.append("21");
System.out.println(text.length());
```

**参考答案**

```text
6
```

**解析：** builder 内容变为 Java21，共六个 UTF-16 代码单元。

**易错点：** append 修改 StringBuilder 本身。

**知识小结：** StringBuilder 可在单线程局部拼接场景减少中间字符串。

#### J01-059 · 代码纠错 · 巩固

下面的比较有时正确、有时错误，怎样按内容比较？

```java
if (left == right) {
    System.out.println("same text");
}
```

**参考答案：** 使用 `left != null && left.equals(right)`，或 `Objects.equals(left, right)` 处理 null。

**解析：** == 比较对象引用身份，不保证内容相同就返回 true。

**易错点：** 空引用调用 equals 会抛 NullPointerException。

**知识小结：** 内容比较用 equals，并明确 null 策略。

#### J01-060 · 代码纠错 · 巩固

为什么打印内容没有变成大写？怎样修正？

```java
String title = "java";
title.toUpperCase();
System.out.println(title);
```

**参考答案：** 保存返回值：`title = title.toUpperCase();`。

**解析：** String 不可变，toUpperCase 返回新字符串而不修改 title 原引用的内容。

**易错点：** 忽略不可变对象方法的返回值会丢掉转换结果。

**知识小结：** 对不可变值，转换操作的结果需要重新接收。

## 基础 · 80 题

### 继承与多态

#### J02-001 · 代码输出 · 巩固

创建 Child 对象后调用 show，会输出什么？

```java
class Parent {
    void show() { System.out.print("P"); }
}
class Child extends Parent {
    @Override void show() { System.out.print("C"); }
}
Parent item = new Child();
item.show();
```

**参考答案**

```text
C
```

**解析：** 实例方法调用根据对象的运行时类型进行动态分派。item 的声明类型是 Parent，但实际对象是 Child，因此执行 Child.show。

**易错点：** 方法重写看运行时对象；字段访问和静态方法隐藏遵循不同规则。

**知识小结：** 区分引用的声明类型与对象的运行时类型。

### 字符串

#### J02-002 · 代码输出 · 基础

程序会输出哪段文字？

```java
String language = "Java";
language.concat(" 21");
System.out.println(language);
```

**参考答案**

```text
Java
```

**解析：** String 是不可变对象。concat 会返回新字符串，但结果没有赋回 language，所以原变量仍引用 Java。

**易错点：** 调用返回新对象的方法，不代表原变量会被更新。

**知识小结：** 接收并保存 String 操作的返回值，或使用 StringBuilder 构造可变文本。

### 异常

#### J02-003 · 单选 · 巩固

Integer.parseInt("x") 抛出的 NumberFormatException 可以被哪个 catch 捕获？

A. 只可以由 NumberFormatException 捕获
B. 由 IllegalArgumentException 或 Exception 捕获
C. 只能由 Throwable 捕获
D. 不能被 catch 捕获

**参考答案：** B

**解析：** NumberFormatException 继承自 IllegalArgumentException，后者继承自 RuntimeException，再继承 Exception。因此这两个父类都能捕获它。

- A：子类本身可以捕获，但不是唯一类型。
- B：正确：两个类型都是 NumberFormatException 的父类。
- C：Throwable 也可以捕获，但并非只能用它。
- D：运行时异常同样可以使用 catch 捕获。

**易错点：** catch 的类型可以是实际异常类的父类。

**知识小结：** 通过异常继承树判断 catch 是否匹配。

### 继承与多态

#### J02-004 · 代码输出 · 综合

程序按什么顺序输出？

```java
class Parent {
    String name = "P";
    String label() { return name; }
}
class Child extends Parent {
    String name = "C";
    @Override String label() { return name; }
}
Parent item = new Child();
System.out.print(item.name + item.label());
```

**参考答案**

```text
PC
```

**解析：** 字段访问按引用的声明类型解析，所以 item.name 读取 Parent.name 的 P。实例方法动态分派到 Child.label，方法体读取 Child.name 的 C。

**易错点：** 不要把字段访问误认为方法重写。

**知识小结：** 字段看引用类型，重写的实例方法看运行时对象类型。

### 面向对象

#### J02-005 · 多选 · 巩固

关于方法重载和重写，哪些说法正确？

A. 重载通常发生在同一类中，方法名相同而参数列表不同
B. 重写要求子类实例方法符合父类方法的签名与可见性约束
C. 只改变返回类型就能构成重载
D. private 方法会被子类重写

**参考答案：** A、B

**解析：** 重载通过不同参数列表区分；重写是在子类提供符合规则的实例方法实现。单独改变返回类型不构成重载，private 方法对外不可继承重写。

- A：正确：重载依赖参数列表差异。
- B：正确：重写还需满足返回类型兼容和不能缩小访问权限等规则。
- C：错误：方法签名不以返回类型区分。
- D：错误：private 方法不参与子类重写。

**易错点：** 不要把重载的编译期选择和重写的运行时分派混为一谈。

**知识小结：** 重载看参数列表；重写看继承关系和实例方法规则。

### 异常

#### J02-006 · 代码纠错 · 综合

下面的 catch 顺序有什么编译问题？应怎样调整？

```java
try {
    readFile();
} catch (Exception error) {
    log(error);
} catch (java.io.IOException error) {
    recover(error);
}
```

**参考答案：** IOException 是 Exception 的子类。前面的 Exception 已覆盖它，使后一个 catch 永远无法到达。应先捕获 IOException，再捕获 Exception。

**解析：** Java 按 catch 块从上到下匹配。较宽的父类型放在前面会遮蔽其后的子类型 catch，编译器会报告不可达代码。

**易错点：** catch 多种异常时，不要把父类放在子类前面。

**知识小结：** 异常捕获顺序从具体类型到一般类型。

### 字符串

#### J02-007 · 代码输出 · 基础

下面代码输出什么？

```java
StringBuilder text = new StringBuilder("Java");
text.append(21);
System.out.println(text);
```

**参考答案**

```text
Java21
```

**解析：** StringBuilder 是可变字符序列，append 会在同一个对象后追加文本。整数 21 转成字符后接在 Java 后面。

**易错点：** StringBuilder.append 修改自身；String.concat 返回新 String。

**知识小结：** 循环拼接或增量构造文本时可以考虑 StringBuilder。

### 类与对象

#### J02-008 · 代码输出 · 巩固

创建 Child 对象时会输出什么？

```java
class Parent {
    Parent() { System.out.print("P"); }
}
class Child extends Parent {
    { System.out.print("I"); }
    Child() { System.out.print("C"); }
}
new Child();
```

**参考答案**

```text
PIC
```

**解析：** 构造子类对象时先完成父类构造并输出 P；父类构造返回后执行子类实例初始化块输出 I；最后执行子类构造器主体输出 C。

**易错点：** 子类实例初始化块不会先于父类构造运行。

**知识小结：** 先父类初始化，再子类字段和实例初始化，最后子类构造器主体。

#### J02-009 · 单选 · 基础

创建对象时，实例字段和构造器的初始化顺序通常是什么？

A. 先执行字段初始化，再执行构造器主体
B. 先执行构造器主体，再初始化字段
C. 字段只会在第一次读取时初始化
D. 每个构造器都从头重复整个父类初始化过程

**参考答案：** A

**解析：** 构造对象时会先完成父类初始化，再按声明顺序初始化本类实例字段，随后执行构造器主体。

**易错点：** 字段初始化表达式也是构造过程的一部分。

**知识小结：** 沿继承链逐层从父类到子类跟踪初始化顺序。

#### J02-010 · 单选 · 基础

类中没有显式声明任何构造器时，Java 通常会做什么？

A. 提供一个任意参数的构造器
B. 提供一个无参默认构造器
C. 禁止创建该类实例
D. 把所有字段都设为 final

**参考答案：** B

**解析：** 未声明构造器时，编译器会提供无参默认构造器。

**易错点：** 只要声明了任意构造器，编译器就不会再自动补无参版本。

**知识小结：** 需要无参创建时，要确认类确实有可用的无参构造器。

#### J02-011 · 多选 · 巩固

关于构造器，哪些说法正确？

A. 构造器中的 `this(...)` 必须是第一条语句
B. 构造器可以声明 `static`
C. `this(...)` 可以调用同一类的另一个构造器
D. 构造器没有返回类型

**参考答案：** A、C、D

**解析：** 构造器以类名命名且不声明返回类型；this 调用可用于构造器串联，并必须位于首行。

**易错点：** 构造器用于实例初始化，不能声明为 static。

**知识小结：** 检查显式构造器调用是否违反首语句限制。

#### J02-012 · 多选 · 巩固

以下哪些值可作为对象创建后的字段默认值？

A. int 字段默认为 0
B. String 字段默认为空字符串
C. 对象引用字段默认为空引用 null
D. boolean 字段默认为 false

**参考答案：** A、C、D

**解析：** 字段按类型获得默认值；引用类型默认是 null，String 不例外。

**易错点：** null 与内容为空的 String 是两种不同状态。

**知识小结：** 默认值不会替代业务上明确的初始化逻辑。

#### J02-013 · 代码输出 · 巩固

构造后输出什么？

```java
class Box { int size = 3; Box() { size = size + 2; } }
Box box = new Box();
System.out.println(box.size);
```

**参考答案**

```text
5
```

**解析：** 字段先初始化为 3，构造器再将其加 2。

**易错点：** 字段初始化不会跳过构造器主体。

**知识小结：** 按初始化顺序逐步更新字段值。

#### J02-014 · 代码输出 · 巩固

两行输出是什么？

```java
class Counter { static int total; int value; Counter() { total++; value = total; } }
Counter a = new Counter();
Counter b = new Counter();
System.out.println(a.value + ":" + b.value);
System.out.println(Counter.total);
```

**参考答案**

```text
1:2
2
```

**解析：** total 是所有对象共享的静态字段；两次构造分别令它变为 1 和 2。

**易错点：** 实例字段 value 则分别保存在不同对象中。

**知识小结：** 区分 static 共享状态和实例状态。

#### J02-015 · 代码输出 · 综合

最终输出什么？

```java
class Label { String text = "A"; Label() { this("B"); text += "C"; } Label(String value) { text = value; } }
System.out.println(new Label().text);
```

**参考答案**

```text
BC
```

**解析：** 无参构造器先委托到带参构造器，将 text 设为 B；随后追加 C。

**易错点：** this(...) 完成后，当前构造器还会继续执行后续语句。

**知识小结：** 构造器链的调用顺序从被委托构造器返回后继续。

#### J02-016 · 代码纠错 · 巩固

为什么 `new User()` 无法编译？如何同时支持无参和 String 参数两种创建方式？

```java
class User { User(String name) {} }
User user = new User();
```

**参考答案：** 保留 `User(String name)`，并显式增加 `User()` 无参构造器。

**解析：** 显式声明 User(String) 后，编译器不再自动生成无参构造器。

**易错点：** 默认构造器仅在完全没有声明构造器时出现。

**知识小结：** 新增构造器后检查旧调用点的兼容性。

#### J02-017 · 代码纠错 · 巩固

这里的字段与参数同名，怎样保证构造器能给字段赋值？

```java
class User {
    String name;
    User(String name) { name = name; }
}
```

**参考答案：** 写成 `this.name = name;`。

**解析：** 未限定的 name 在构造器中指向参数，`name = name` 只给参数自身赋值。

**易错点：** 形参与字段同名时，作用域会遮蔽字段。

**知识小结：** 使用 this 明确指向当前对象字段。

### 继承与多态

#### J02-018 · 单选 · 基础

父类引用指向子类对象，调用一个已重写的实例方法时，执行哪个实现？

A. 引用变量声明类型对应的父类实现
B. 由变量名首字母决定
C. 运行时对象所属子类的重写实现
D. 编译器随机选择一个实现

**参考答案：** C

**解析：** 实例方法重写采用动态分派，执行版本由运行时对象类型决定。

**易错点：** 字段访问和静态方法隐藏遵循不同规则。

**知识小结：** 把变量的静态类型与对象的实际类型分开分析。

#### J02-019 · 单选 · 基础

子类重写父类方法时，访问权限可以怎样变化？

A. 只能变得更严格
B. 必须改成 private
C. 可以任意变化
D. 可以保持或放宽，不能变得更严格

**参考答案：** D

**解析：** 重写方法不能缩小父类方法的可访问范围。

**易错点：** 返回类型和异常声明也受重写规则限制。

**知识小结：** 使用 `@Override` 让编译器验证重写意图。

#### J02-020 · 多选 · 巩固

哪些说法符合方法重写规则？

A. `final` 实例方法不能被子类重写
B. 子类实例方法可以重写可访问的父类实例方法
C. 子类重写方法不能声明比父类更宽的受检异常
D. 静态方法通过动态分派被重写

**参考答案：** A、B、C

**解析：** final 禁止继续重写；受检异常不能扩大父类方法承诺的范围。

**易错点：** 静态方法隐藏而非实例重写，不参与动态分派。

**知识小结：** 使用 Override 注解并检查异常与访问权限。

#### J02-021 · 多选 · 巩固

以下关于多态的说法哪些正确？

A. 字段访问也会像实例方法一样动态分派
B. 编译期会检查引用静态类型是否声明了所调用方法
C. 父类引用可以指向其子类实例
D. 向下转型在实际对象不匹配时会抛 ClassCastException

**参考答案：** B、C、D

**解析：** 引用静态类型决定编译期可见成员；实例方法的实现再由运行时类型决定。

**易错点：** 字段访问依据表达式的静态类型，不进行方法式动态分派。

**知识小结：** 必要时使用 instanceof 模式匹配或显式类型检查。

#### J02-022 · 代码输出 · 巩固

输出哪一个方法结果？

```java
class Parent { String name() { return "P"; } }
class Child extends Parent { @Override String name() { return "C"; } }
Parent item = new Child();
System.out.println(item.name());
```

**参考答案**

```text
C
```

**解析：** 调用的是实例方法；运行时对象为 Child，因此执行重写实现。

**易错点：** Parent 类型变量不意味着对象实际类型是 Parent。

**知识小结：** 跟踪方法调用时关注对象运行时类型。

#### J02-023 · 代码输出 · 综合

打印结果是什么？

```java
class Parent { int value = 1; int get() { return value; } }
class Child extends Parent { int value = 2; @Override int get() { return value; } }
Parent p = new Child();
System.out.println(p.value + p.get());
```

**参考答案**

```text
3
```

**解析：** 字段访问 `p.value` 按引用静态类型取父类字段 1；方法调用动态分派到子类返回 2。

**易错点：** 字段隐藏和方法重写是两种不同机制。

**知识小结：** 同一表达式中分别判断字段访问与实例方法调用。

#### J02-024 · 代码输出 · 综合

程序最后输出什么？

```java
class A { static String kind() { return "A"; } }
class B extends A { static String kind() { return "B"; } }
A ref = new B();
System.out.println(ref.kind());
```

**参考答案**

```text
A
```

**解析：** 静态方法按引用表达式的编译期类型解析，`ref` 的声明类型是 A。

**易错点：** 不建议通过实例引用调用静态方法；直接写类名更清晰。

**知识小结：** static 方法会隐藏，不按运行时对象动态分派。

#### J02-025 · 代码纠错 · 巩固

为什么不能用 `@Override` 标记这个方法？修正哪个签名？

```java
class Base { void save(Object value) {} }
class Child extends Base { @Override void save(String value) {} }
```

**参考答案：** 若要重写，应改为 `void save(Object value)`；若保留 String 参数，它是重载，应移除 Override。

**解析：** 参数列表不同，因此 save(String) 没有重写 save(Object)。

**易错点：** 返回类型相同也不能弥补参数签名不同。

**知识小结：** 重写要求匹配方法签名，并可有合法协变返回类型。

#### J02-026 · 代码纠错 · 巩固

为什么这个向下转型会在运行时失败？怎样安全调用子类方法？

```java
class Animal {}
class Cat extends Animal { void meow() {} }
Animal pet = new Animal();
((Cat) pet).meow();
```

**参考答案：** 先确认 `pet instanceof Cat` 后再转型，或将 pet 初始化为 Cat 对象。

**解析：** pet 实际指向 Animal 实例，不是 Cat 实例。

**易错点：** 编译器允许相关类之间显式向下转型，但无法保证运行时对象匹配。

**知识小结：** 运行时类型检查可以避免不安全转型。

### 接口

#### J02-027 · 单选 · 基础

接口中未写访问修饰符的抽象实例方法，隐含的访问级别是什么？

A. public
B. protected
C. 仅对同包可见
D. private

**参考答案：** A

**解析：** 接口的抽象实例方法隐式为 public；实现时不能降低可见性。

**易错点：** private 接口方法是用于接口内部复用的另一种语法。

**知识小结：** 实现接口方法时保留 public。

#### J02-028 · 单选 · 基础

一个类实现接口时，对接口抽象方法通常需要做什么？

A. 只需在构造器中调用一次
B. 提供满足契约的 public 实现，或将类声明为 abstract
C. 接口方法会自动变成字段
D. 把方法改成 private

**参考答案：** B

**解析：** 非抽象类必须实现全部继承的抽象方法。

**易错点：** 接口方法的公开契约不能通过较低权限实现。

**知识小结：** 编译错误通常会指出尚未实现的方法。

#### J02-029 · 多选 · 巩固

关于接口的说法哪些正确？

A. 一个类可以实现多个接口
B. 接口可以声明 default 实例方法
C. 接口字段默认是 public static final
D. 接口可以直接 `new Interface()` 创建实例

**参考答案：** A、B、C

**解析：** 接口支持多实现契约；字段是常量，default 方法提供默认实例行为。

**易错点：** 接口本身不能直接实例化。

**知识小结：** 需要对象时创建实现类或使用匿名实现。

#### J02-030 · 多选 · 综合

类实现的两个接口提供了同签名且互不相关的 default 方法，哪些做法有效？

A. 实现类可用 `InterfaceA.super.method()` 调用其中一个默认实现
B. 编译器会随机选一个接口
C. 把其中一个接口改成父类即可自动决定
D. 实现类重写该方法以消除冲突

**参考答案：** A、D

**解析：** 类必须显式解决两个互不相关 default 实现之间的冲突。

**易错点：** 实现时可以分别委托到明确的接口默认实现。

**知识小结：** 冲突不能依赖声明顺序或编译器猜测。

#### J02-031 · 代码输出 · 巩固

输出结果是什么？

```java
interface Greeter { default String greet() { return "hello"; } }
class Person implements Greeter {}
System.out.println(new Person().greet());
```

**参考答案**

```text
hello
```

**解析：** Person 没有重写 greet，因此使用接口提供的 default 实现。

**易错点：** default 是实例方法，不是静态方法。

**知识小结：** 默认方法帮助接口演进，同时仍可由实现类覆盖。

#### J02-032 · 代码输出 · 巩固

程序会打印什么？

```java
interface A { default String name() { return "A"; } }
class B implements A { @Override public String name() { return A.super.name() + "B"; } }
System.out.println(new B().name());
```

**参考答案**

```text
AB
```

**解析：** B 的实现显式调用 A 的默认方法并追加 B。

**易错点：** `A.super` 只能在合适的实现上下文中调用直接相关接口默认方法。

**知识小结：** 接口默认方法可被组合复用，但冲突需要显式处理。

#### J02-033 · 代码输出 · 巩固

程序输出什么？

```java
interface Limits { int MAX = 8; }
System.out.println(Limits.MAX);
```

**参考答案**

```text
8
```

**解析：** 接口字段隐式为 public static final 常量，可通过接口名访问。

**易错点：** 接口字段不是每个实现对象各自保存的实例字段。

**知识小结：** 共享常量应使用类名或接口名限定访问。

#### J02-034 · 代码纠错 · 巩固

为什么实现类无法编译？

```java
interface Store { void save(); }
class FileStore implements Store { void save() {} }
```

**参考答案：** 将实现方法声明为 `public void save() {}`；仅把 FileStore 改为 abstract 仍不能保留这个低可见性的同签名方法。

**解析：** 接口方法是 public，实现方法不能降低可见性。

**易错点：** 包内默认可见不满足接口的公开契约。

**知识小结：** 实现接口方法时检查 public 修饰符。

#### J02-035 · 代码纠错 · 巩固

两个 default 方法冲突时如何明确选择实现？

```java
interface Left { default void run() {} }
interface Right { default void run() {} }
class Task implements Left, Right {}
```

**参考答案：** 在 Task 中重写 `public void run()`，并在需要时调用 `Left.super.run()` 或 `Right.super.run()`。

**解析：** 两个不相关接口都提供 run 默认实现，类没有唯一可继承实现。

**易错点：** 冲突由具体类解决，而不是根据 implements 顺序选择。

**知识小结：** 多接口默认方法重名时，显式覆盖并表达选择。

### 面向对象

#### J02-036 · 单选 · 基础

`private` 实例字段最直接的设计目的是什么？

A. 阻止对象被垃圾回收
B. 让字段在所有实例间共享
C. 限制外部直接访问，并由类自身维护对象状态
D. 自动让字段线程安全

**参考答案：** C

**解析：** private 把直接访问限制在类内部，便于保护不变量。

**易错点：** 访问控制本身不提供同步，也不会改变字段是否静态。

**知识小结：** 把验证规则放在负责状态的类中。

#### J02-037 · 单选 · 基础

`static` 字段通常属于谁？

A. 每个对象各自独有一份
B. 只有子类对象拥有
C. 每次方法调用独有一份
D. 类本身，所有实例共享一份

**参考答案：** D

**解析：** 静态字段与类关联，而非每个实例单独持有。

**易错点：** static 不意味着值不可变；是否可变由字段类型和修饰符另定。

**知识小结：** 共享可变 static 状态需要额外考虑并发与生命周期。

#### J02-038 · 多选 · 巩固

关于 final 修饰符，哪些说法正确？

A. `final` 类不能被继承
B. final 引用保证所指对象的字段也不可变
C. 局部变量 `final int n` 在赋值后不能再赋值
D. `final` 实例方法不能被子类重写

**参考答案：** A、C、D

**解析：** final 可限制变量重新赋值、方法重写和类继承。

**易错点：** final 引用限制引用本身重新指向，不自动冻结对象状态。

**知识小结：** 分清引用不可变与引用目标不可变。

#### J02-039 · 多选 · 巩固

关于静态上下文和实例成员，哪些说法正确？

A. static 字段的值在每个对象之间独立保存
B. static 方法没有隐式的当前对象 this
C. static 方法可以通过明确的对象引用访问实例字段
D. 实例方法可以直接访问同类 static 字段

**参考答案：** B、C、D

**解析：** 静态上下文没有当前实例，但可通过明确的对象引用访问其实例成员；实例方法也可访问同类静态成员。

**易错点：** 在 static 方法中不能直接使用 this；访问实例字段要有对象引用。

**知识小结：** 编译器报非静态成员错误时，先确认是否缺少对象引用。

#### J02-040 · 代码输出 · 巩固

执行结果是什么？

```java
class Meter { static int created; Meter() { created++; } }
new Meter(); new Meter();
System.out.println(Meter.created);
```

**参考答案**

```text
2
```

**解析：** 两次构造都递增同一个类级别字段。

**易错点：** 静态字段不会因创建新实例而重置。

**知识小结：** 统计对象数量时，static 字段常用于共享计数。

#### J02-041 · 代码输出 · 巩固

程序输出什么？

```java
final int[] values = {1, 2};
values[0] = 7;
System.out.println(values[0]);
```

**参考答案**

```text
7
```

**解析：** final 限制 values 不能改为引用另一个数组，但数组元素仍可修改。

**易错点：** final 引用不等于不可变对象。

**知识小结：** 深度不可变需要不可变对象设计，而不只是 final 引用。

#### J02-042 · 代码输出 · 巩固

下列代码打印什么？

```java
class Config { static final int PORT = 8080; }
System.out.println(Config.PORT);
```

**参考答案**

```text
8080
```

**解析：** 静态 final 字段保存共享常量值，可通过类名访问。

**易错点：** 常量命名惯例使用大写字母和下划线。

**知识小结：** final 用于不应重新赋值的常量或引用。

#### J02-043 · 代码纠错 · 巩固

为什么 static 方法中访问 this 会编译失败？

```java
class Session {
    static void show() { System.out.println(this); }
}
```

**参考答案：** 删除 static，将 show 声明为实例方法；或去掉 this 并明确需要访问的静态成员。

**解析：** static 方法调用没有当前对象，因此不存在 this。

**易错点：** 不要只为了访问实例成员而把方法误标为 static。

**知识小结：** 判断方法是否属于对象行为，再决定是否需要实例上下文。

#### J02-044 · 代码纠错 · 巩固

为什么 final 列表引用不能重新赋值，却仍可向列表添加元素？如何提供不可修改的副本？

```java
final List<String> names = new ArrayList<>();
names.add("Ada");
```

**参考答案：** final 只限制 names 重新指向其他 List；可使用 `List.copyOf(names)` 创建不可修改的副本。

**解析：** 集合引用仍指向可变对象，final 不阻止 add。

**易错点：** 不可修改视图可能仍会反映原列表后续变化；副本与视图不同。

**知识小结：** 保护集合状态时同时控制引用和底层对象的可变性。

### 字符串

#### J02-045 · 单选 · 基础

重写 `equals` 时通常还必须一起重写什么？

A. hashCode
B. finalize
C. toString
D. clone

**参考答案：** A

**解析：** 相等对象必须拥有相同 hashCode，否则哈希集合可能无法正确查找。

**易错点：** 反过来，相同 hashCode 并不保证 equals 为 true。

**知识小结：** 定义值相等时同步维护 equals 和 hashCode 契约。

#### J02-046 · 单选 · 基础

调用 `String.substring` 会如何影响原字符串？

A. 只会返回字符数组
B. 返回新字符串结果，原 String 保持不变
C. 原 String 从指定位置被裁掉
D. 清空原字符串并复用对象

**参考答案：** B

**解析：** String 不可变，substring 产生表示所选内容的 String 结果。

**易错点：** 忽略返回值时，转换结果不会保存在原变量中。

**知识小结：** 把返回值赋回变量或交给下一个操作。

#### J02-047 · 多选 · 巩固

以下哪些符合 `equals` / `hashCode` 契约？

A. equals 应满足对称性
B. hashCode 相等就一定 equals 为 true
C. 两个不同对象可以拥有相同 hashCode
D. 若 a.equals(b) 为 true，则两者 hashCode 必须相等

**参考答案：** A、C、D

**解析：** 哈希允许冲突；equals 对称且相等对象必须产生相同哈希值。

**易错点：** 哈希值只是筛选线索，不是唯一对象标识。

**知识小结：** 自定义值对象时使用一致的字段集合实现两种方法。

#### J02-048 · 多选 · 巩固

为什么不应把可变字段纳入哈希键后再修改它？

A. 哈希桶位置依赖插入时的哈希值
B. 适合作键的对象通常应保持参与相等比较的状态稳定
C. HashMap 会自动把旧键移动到正确桶
D. 修改后再查找可能无法按新哈希找到该键

**参考答案：** A、B、D

**解析：** 键放入哈希表后若其哈希相关状态变化，桶索引与当前 hashCode 不一致。

**易错点：** HashMap 不会侦测键对象字段并自动重排。

**知识小结：** 使用不可变键或确保作为键期间不改变相等性状态。

#### J02-049 · 代码输出 · 巩固

输出什么？

```java
String value = "study";
value.replace("u", "a");
System.out.println(value);
```

**参考答案**

```text
study
```

**解析：** replace 返回新 String，但返回值未接收，value 仍是 study。

**易错点：** 不可变字符串操作不会原地改写变量所指对象。

**知识小结：** 需要变换结果时保存方法返回值。

#### J02-050 · 代码输出 · 巩固

两个判断依次输出什么？

```java
String a = "cat";
String b = "c" + "at";
System.out.println(a == b);
System.out.println(a.equals(b));
```

**参考答案**

```text
true
true
```

**解析：** 这两个常量表达式在编译期可折叠为相同字符串常量；equals 也比较相同内容。

**易错点：** 常量池行为不应成为比较字符串内容的写法依据。

**知识小结：** 业务语义要比较文本内容时始终使用 equals。

#### J02-051 · 代码输出 · 巩固

这两个对象是否相等？

```java
record Point(int x, int y) {}
Point p = new Point(2, 3);
Point q = new Point(2, 3);
System.out.println(p.equals(q));
```

**参考答案**

```text
true
```

**解析：** record 自动生成基于组件值的 equals 实现。

**易错点：** record 的组件引用本身仍可能指向可变对象。

**知识小结：** record 适合表达以数据为中心的浅层值类型。

#### J02-052 · 代码纠错 · 巩固

为什么这个类放进 HashSet 后无法按预期去重？

```java
class Key { int id; public boolean equals(Object o) { return o instanceof Key k && id == k.id; } }
```

**参考答案：** 同时重写 hashCode，并基于相同的 id 字段计算哈希值。

**解析：** equals 认为相同 id 相等，但继承的 Object.hashCode 可能不同。

**易错点：** HashSet 先用 hashCode 定位，再用 equals 比较。

**知识小结：** 相等性规则与哈希计算必须使用一致状态。

#### J02-053 · 代码纠错 · 巩固

为什么小写结果没有被打印？

```java
String text = "JAVA";
text.toLowerCase();
System.out.println(text);
```

**参考答案：** 将返回值保存：`text = text.toLowerCase();`。

**解析：** String 不可变，toLowerCase 不会改写原内容。

**易错点：** 转换方法返回新值；忽略返回值会丢失结果。

**知识小结：** 值对象的转换应显式接收返回对象。

### 异常

#### J02-054 · 单选 · 基础

`finally` 块通常何时执行？

A. 只在 JVM 正常退出时执行
B. 只有 try 正常结束时执行
C. 离开 try/catch 控制流时通常执行，包括发生异常的情况
D. 只有 catch 捕获异常后执行

**参考答案：** C

**解析：** finally 常用于清理，在离开 try/catch 时运行。

**易错点：** 调用 System.exit 或进程突然终止等情况可能绕过 finally。

**知识小结：** 需要可靠关闭资源时优先考虑 try-with-resources。

#### J02-055 · 单选 · 基础

try-with-resources 要求资源类型通常满足什么条件？

A. 必须是 static 字段
B. 实现 Serializable
C. 必须继承 Thread
D. 实现 AutoCloseable

**参考答案：** D

**解析：** 编译器会在适当时机调用资源的 close 方法，资源需实现 AutoCloseable。

**易错点：** Closeable 是其子接口，常见 IO 类型也支持该机制。

**知识小结：** 用 try-with-resources 表达明确的资源所有权边界。

#### J02-056 · 多选 · 巩固

关于受检异常及 catch 顺序，哪些描述正确？

A. RuntimeException 的子类属于非受检异常
B. 调用可能抛出受检异常的方法时需捕获或声明
C. 先 catch 父类异常，再 catch 其子类异常会导致后者不可达
D. Error 通常要求每个调用点都捕获

**参考答案：** A、B、C

**解析：** 受检异常由编译器检查；RuntimeException 和 Error 及其子类属于非受检异常。

**易错点：** 应先捕获更具体的类型，否则其后的子类 catch 不可达。

**知识小结：** 只捕获能够处理或转换的异常，避免空 catch。

#### J02-057 · 多选 · 巩固

关于 try-with-resources，哪些说法正确？

A. 必须手动在 finally 中再次调用 close
B. 即使 try 块抛异常，已创建资源也会尝试关闭
C. 资源按声明的逆序关闭
D. 多个资源可在资源头中依次声明

**参考答案：** B、C、D

**解析：** 资源会自动关闭，关闭顺序与初始化顺序相反。

**易错点：** 通常不要重复手动 close，否则可能重复释放。

**知识小结：** 声明资源后让语言结构承担正常清理责任。

#### J02-058 · 代码输出 · 巩固

最后输出什么？

```java
try { System.out.print("T"); } finally { System.out.print("F"); }
```

**参考答案**

```text
TF
```

**解析：** try 主体先打印 T，随后 finally 打印 F。

**易错点：** finally 不是在 try 前执行。

**知识小结：** 按实际控制流顺序追踪输出与清理。

#### J02-059 · 代码输出 · 综合

方法返回值是什么？

```java
static int value() { try { return 1; } finally { System.out.print("F"); } }
System.out.println("R" + value());
```

**参考答案**

```text
FR1
```

**解析：** 调用 value 时先在 finally 打印 F，随后返回 1；外层打印 R1。

**易错点：** finally 中若再执行 return 会覆盖先前返回值，通常应避免。

**知识小结：** finally 用于清理，不要在其中改变控制流结果。

#### J02-060 · 代码输出 · 巩固

资源关闭前后会打印什么？

```java
class Tracked extends java.io.StringReader { boolean closed; Tracked() { super("x"); } public void close() { closed = true; } }
Tracked in = new Tracked();
try (in) { System.out.println((char) in.read()); }
System.out.println(in.closed);
```

**参考答案**

```text
x
true
```

**解析：** StringReader 读取 x；离开 try-with-resources 后自动调用覆盖的 close，将 closed 设为 true。

**易错点：** try-with-resources 会在资源初始化成功后负责关闭。

**知识小结：** 用可观察的 close 状态验证资源清理时序。

#### J02-061 · 代码纠错 · 巩固

为什么这个 multi-catch 无法编译？如何处理这两种异常？

```java
try { readFile(); } catch (java.io.IOException | java.io.FileNotFoundException e) {
    recover(e);
}
```

**参考答案：** FileNotFoundException 是 IOException 的子类；这里只写 `catch (IOException e)` 即可同时捕获两者。

**解析：** multi-catch 的异常备选类型不能具有子类型关系。

**易错点：** 不要在同一个 multi-catch 中重复列出已由父类型覆盖的异常。

**知识小结：** 若需分别处理，可写更具体的 catch，再写一般的 catch。

#### J02-062 · 代码纠错 · 巩固

怎样保证 reader 在读取成功或抛异常后都会关闭？

```java
var reader = new java.io.FileReader(path);
int first = reader.read();
```

**参考答案：** 将资源放入 `try (var reader = new java.io.FileReader(path)) { ... }`。

**解析：** 当前代码没有关闭 reader，发生异常时更无法可靠清理。

**易错点：** FileReader 实现 AutoCloseable。

**知识小结：** 把资源声明到 try-with-resources 头中。

### 继承与多态

#### J02-063 · 单选 · 基础

抽象类最适合用来表达什么？

A. 含有共同状态或实现，并要求子类补全部分行为的基类
B. 完全不能声明字段和构造器的类型
C. 可以直接创建实例的工具类
D. 只能由一个类实现的接口别名

**参考答案：** A

**解析：** 抽象类可组合字段、构造器、具体方法和抽象方法，但不能直接实例化。

**易错点：** 抽象类也可以没有抽象方法，关键在于类型不能被直接构造。

**知识小结：** 为共享实现建立父类时，避免把所有行为都强塞给子类。

#### J02-064 · 单选 · 基础

子类重写方法可以把父类返回类型改成什么？

A. 任意不相关类型
B. 引用类型的合法子类型（协变返回类型）
C. 只能改成 void
D. 返回类型必须比父类更宽

**参考答案：** B

**解析：** 引用类型返回值允许使用协变类型，重写实现返回父类返回类型的子类型。

**易错点：** 基本类型返回值不能这样协变。

**知识小结：** 确认返回类型可赋给父类方法声明的返回类型。

#### J02-065 · 多选 · 巩固

关于抽象类，哪些描述正确？

A. 可以包含抽象方法和具体方法
B. 不能直接使用 new 创建抽象类实例
C. 抽象子类可以暂不实现父类所有抽象方法
D. 抽象类不能声明构造器

**参考答案：** A、B、C

**解析：** 抽象类可保留未实现契约，直到某个具体子类完成实现。

**易错点：** 构造器参与子类构造，但抽象类仍不能独立实例化。

**知识小结：** 把抽象类型与其子类的实例化边界分清。

#### J02-066 · 多选 · 巩固

以下哪些对子类构造过程的描述正确？

A. 未显式指定时，子类构造器会尝试调用父类无参构造器
B. 子类构造器可以在任意位置调用 super(...)
C. 父类没有可访问无参构造器时，子类需显式调用可用父类构造器
D. 创建子类对象时会先构造父类部分

**参考答案：** A、C、D

**解析：** 父类部分必须先初始化；super(...) 显式构造调用必须位于首行。

**易错点：** 父类构造器缺失会让隐式 super() 无法解析。

**知识小结：** 检查继承链上每层构造器的可访问性与调用顺序。

#### J02-067 · 代码输出 · 巩固

这个重写调用返回哪种类型的名字？

```java
class Animal {}
class Dog extends Animal {}
class Factory { Animal create() { return new Animal(); } }
class DogFactory extends Factory { @Override Dog create() { return new Dog(); } }
System.out.println(new DogFactory().create().getClass().getSimpleName());
```

**参考答案**

```text
Dog
```

**解析：** 子类方法采用合法协变返回 Dog，因此创建并返回 Dog 实例。

**易错点：** 重写方法的返回类型必须满足父类签名的赋值兼容性。

**知识小结：** 协变返回类型让具体工厂可暴露更具体的结果。

#### J02-068 · 代码输出 · 综合

输出顺序是什么？

```java
class Parent { Parent() { print(); } void print() { System.out.print("P"); } }
class Child extends Parent { int value = 7; @Override void print() { System.out.print(value); } }
new Child();
```

**参考答案**

```text
0
```

**解析：** 父类构造期间会动态调用子类重写的 print，但子类字段初始化尚未执行，value 仍为默认值 0。

**易错点：** 构造器中调用可重写方法会暴露未初始化的子类状态。

**知识小结：** 构造期间尽量避免调用可被子类覆盖的方法。

#### J02-069 · 代码输出 · 巩固

执行构造后输出什么？

```java
class Base { int n = 1; Base() { n += 2; } }
class Sub extends Base { int m = 4; Sub() { m += n; } }
Sub s = new Sub();
System.out.println(s.n + ":" + s.m);
```

**参考答案**

```text
3:7
```

**解析：** 先初始化父类 n=1，再执行父类构造变成 3；子类字段 m=4 后，子类构造把 n 加到 m 得 7。

**易错点：** 父类初始化和构造在子类字段初始化之前完成。

**知识小结：** 继承构造题按父类到子类逐段模拟。

#### J02-070 · 代码纠错 · 巩固

为什么子类构造器没有匹配到 super()？

```java
class Base { Base(String name) {} }
class Child extends Base { Child() {} }
```

**参考答案：** 在 Child 构造器首行写 `super("name")`，或给 Base 增加可访问的无参构造器。

**解析：** 编译器隐式插入 super()，但 Base 只提供带参构造器。

**易错点：** 父类没有无参构造器时，子类必须显式选一个父类构造器。

**知识小结：** 每个构造器的第一步都必须形成合法的父类初始化链。

#### J02-071 · 代码纠错 · 综合

如何避免父类构造期间访问到未初始化的子类字段？

```java
class Base { Base() { initialize(); } void initialize() {} }
class Child extends Base { int limit = 10; @Override void initialize() { System.out.println(limit); } }
```

**参考答案：** 避免在 Base 构造器中调用可重写方法；把初始化逻辑留给显式构造步骤或私有方法。

**解析：** 父类构造调用到 Child.initialize 时，Child 字段初始化还未发生。

**易错点：** 动态分派在构造期间仍然生效。

**知识小结：** 构造器保持简单，不向子类暴露半初始化对象。

### 类与对象

#### J02-072 · 单选 · 基础

record 的主要用途是什么？

A. 替代所有可变业务实体
B. 自动深拷贝每一个组件对象
C. 简洁表达以组件数据为中心的不可继承数据载体
D. 只能包含 static 字段

**参考答案：** C

**解析：** record 为数据载体生成组件访问器、构造器、equals、hashCode 和 toString 等成员。

**易错点：** 组件对象若可变，record 不会自动深度冻结它。

**知识小结：** 选择 record 前确认其值语义和浅层不可变性适合需求。

#### J02-073 · 单选 · 基础

record 的组件访问方式通常是什么？

A. 必须直接访问 public 字段 `point.x`
B. 调用 getX()，编译器总会生成 JavaBean getter
C. 通过静态方法访问
D. 调用与组件同名的访问器，例如 `point.x()`

**参考答案：** D

**解析：** record 组件会生成同名访问器方法。

**易错点：** record 默认不生成 getX 风格的 JavaBean getter。

**知识小结：** 使用组件名访问器表达 record 数据。

#### J02-074 · 多选 · 巩固

关于 record，哪些描述正确？

A. record 可以实现接口
B. record 的组件字段默认可被任意外部代码修改
C. record 隐式继承 Record 类
D. record 不能显式继承另一个类

**参考答案：** A、C、D

**解析：** record 有固定的类继承位置，但仍可实现接口。

**易错点：** 组件字段为 private final，外部通常通过访问器读取。

**知识小结：** 组件引用 final 不代表其引用的对象深度不可变。

#### J02-075 · 多选 · 巩固

设计值对象时，哪些行为有助于可靠相等性？

A. 只要返回同一 hashCode 就能证明对象相等
B. equals 与 hashCode 使用一致的值字段
C. 将关键状态设为不可变或避免创建后修改
D. 把对象身份与内容相等混为一个规则

**参考答案：** B、C

**解析：** 稳定的相等字段与一致 hashCode 有利于在集合中可靠使用值对象。

**易错点：** 哈希冲突存在，hashCode 相同不代表 equals。

**知识小结：** 值对象优先采用明确且稳定的值语义。

#### J02-076 · 代码输出 · 巩固

输出结果是什么？

```java
record Size(int width, int height) {}
Size a = new Size(2, 5);
System.out.println(a.width() * a.height());
```

**参考答案**

```text
10
```

**解析：** width() 返回 2，height() 返回 5，乘积为 10。

**易错点：** record 访问器使用组件名，不会自动生成 getWidth。

**知识小结：** record 适合紧凑表达数据参数。

#### J02-077 · 代码输出 · 巩固

下面两项依次是什么？

```java
record User(String name) {}
User a = new User("Mia");
User b = new User("Mia");
System.out.println(a.equals(b) + ":" + a);
```

**参考答案**

```text
true:User[name=Mia]
```

**解析：** record 自动按组件值比较，并生成包含组件名称和值的 toString。

**易错点：** record 自动方法是浅层的；引用组件的内部变化需要谨慎。

**知识小结：** 减少纯数据类型的样板代码，同时了解生成行为。

#### J02-078 · 代码输出 · 巩固

输出是否相同？

```java
record Pair(int left, int right) {}
System.out.println(new Pair(1, 2).hashCode() == new Pair(1, 2).hashCode());
```

**参考答案**

```text
true
```

**解析：** 两个 record 值相等，生成的 hashCode 对相同组件产生相同结果。

**易错点：** 不同值也可能出现哈希冲突。

**知识小结：** 哈希码用于散列，不是唯一 ID。

#### J02-079 · 代码纠错 · 巩固

为什么这个 record 声明非法？

```java
record Token(String value) {
    String value;
}
```

**参考答案：** 删除重复字段声明；record 组件已经声明了对应的 private final 字段。

**解析：** 组件字段由 record 语法生成，不能再声明同名实例字段。

**易错点：** 可以在规范构造器中校验或规范化组件值。

**知识小结：** 把不变量放入构造过程，而不是重复定义组件存储。

#### J02-080 · 代码纠错 · 巩固

如何拒绝 null 名称并保持 record 简洁？

```java
record User(String name) {}
```

**参考答案：** 使用紧凑构造器：`record User(String name) { User { java.util.Objects.requireNonNull(name); } }`。

**解析：** 自动生成的规范构造器不会校验引用组件非 null。

**易错点：** 紧凑构造器可在组件字段赋值前校验参数。

**知识小结：** 在值对象边界集中校验必需组件。

## 进阶 · 80 题

### 泛型

#### J03-001 · 单选 · 巩固

关于下面的列表，哪项操作可以通过编译？

```java
List<? extends Number> numbers = new ArrayList<Integer>();
```

A. numbers.add(1)
B. numbers.add(1.5)
C. Number n = numbers.get(0)
D. numbers.add(new Object())

**参考答案：** C

**解析：** ? extends Number 表示某种未知的 Number 子类型。读取时可以安全地按 Number 使用；写入任意具体 Number 都无法保证与实际子类型一致。

- A：不能保证实际列表是 List<Integer>。
- B：不能保证实际列表是 List<Double>。
- C：正确：读出的元素至少可以视为 Number。
- D：Object 不是 Number 的子类型。

**易错点：** extends 通配符适合安全读取，不适合添加非 null 的具体值。

**知识小结：** 记住 PECS：生产者用 extends，消费者用 super。

### 集合

#### J03-002 · 代码输出 · 巩固

下面代码会输出什么？

```java
List<Integer> values = new ArrayList<>(List.of(7, 9, 11));
System.out.println(values.remove(1) + " " + values);
```

**参考答案**

```text
9 [7, 11]
```

**解析：** List 对整数参数提供 remove(int index) 与 remove(Object value) 两个重载。字面量 1 是 int，因此按下标删除索引 1 的元素 9，并返回被删元素。

**易错点：** 调用 remove(1) 删除的是第二个元素，不是值为 1 的元素。

**知识小结：** 要按值删除 Integer，可显式传入 Integer.valueOf(value)。

### Map

#### J03-003 · 代码输出 · 基础

执行两次 put 后，map 的大小和键 score 对应的值依次是什么？

```java
Map<String, Integer> map = new HashMap<>();
map.put("score", 8);
map.put("score", 10);
System.out.println(map.size() + " " + map.get("score"));
```

**参考答案**

```text
1 10
```

**解析：** Map 中一个键最多对应一个当前值。第二次 put 使用相同键，会替换原来的 8，不会增加键的数量。

**易错点：** put 返回旧值（如有），但 size 统计键而不是 put 调用次数。

**知识小结：** 重复键写入会更新映射的值。

### Stream

#### J03-004 · 多选 · 巩固

关于 Stream 操作，哪些说法正确？

A. filter 是中间操作，通常不会单独触发遍历
B. map 是终端操作
C. collect 和 forEach 都可以作为终端操作
D. 一个 Stream 不能在终端操作后再次消费

**参考答案：** A、C、D

**解析：** filter、map 等中间操作描述处理流水线；collect、forEach 会触发终端消费。Stream 被终端操作消费后不能再复用。

- A：正确：需有终端操作才会开始处理元素。
- B：错误：map 是中间操作。
- C：正确：两者都可以结束流水线。
- D：正确：已消费的 Stream 不应再次使用。

**易错点：** 声明中间操作链并不等于它已经执行。

**知识小结：** Stream 通常是惰性流水线，由终端操作驱动。

### IO

#### J03-005 · 单选 · 巩固

多个资源在 try-with-resources 中关闭时，顺序是什么？

A. 按声明顺序关闭
B. 按声明的逆序关闭
C. 只有第一个资源会关闭
D. 资源不会自动关闭

**参考答案：** B

**解析：** try-with-resources 会自动关闭成功初始化的资源，并按声明顺序的逆序关闭。这一顺序适合先创建外层、后创建内层资源的场景。

- A：与语言规定的关闭顺序相反。
- B：正确：后声明的资源先关闭。
- C：每个成功初始化的资源都会尝试关闭。
- D：自动关闭正是该语法的用途。

**易错点：** 资源初始化失败时，只关闭已经成功初始化的资源。

**知识小结：** 用 try-with-resources 管理 AutoCloseable 资源。

### Map

#### J03-006 · 代码纠错 · 综合

Key 的 equals/hashCode 均依赖 id。修改键的 id 后，为什么 map.get(key) 可能返回 null？如何避免？

```java
class Key { int id; Key(int id) { this.id = id; }
    @Override public boolean equals(Object o) { return o instanceof Key k && id == k.id; }
    @Override public int hashCode() { return id; } }
Key key = new Key(1);
Map<Key, String> map = new HashMap<>();
map.put(key, "value");
key.id = 2;
System.out.println(map.get(key));
```

**参考答案：** 键插入时所在桶由当时的 hashCode 决定。修改参与 equals/hashCode 的字段后，查找会使用新的哈希值，可能定位到别的桶。作为 Map 键的相等性字段应保持不变，通常让键不可变。

**解析：** HashMap 先按 hash 定位，再比较键是否相等。键的哈希和相等规则在存放期间变化，会破坏查找前提。

**易错点：** 即使仍持有同一个对象引用，也不代表它能从原桶中被正确找到。

**知识小结：** 用不可变对象作为哈希键，或避免在映射存续期间修改键的相等性字段。

### Stream

#### J03-007 · 代码输出 · 巩固

这条流水线输出什么？

```java
int total = List.of(2, 4, 6).stream()
    .filter(n -> n % 4 == 0)
    .map(n -> n / 2)
    .mapToInt(Integer::intValue)
    .sum();
System.out.println(total);
```

**参考答案**

```text
2
```

**解析：** filter 只保留能被 4 整除的元素 4。map 将它变成 2，mapToInt 转成 IntStream，sum 得到 2。

**易错点：** 按顺序写出每个中间流的元素，避免跳过筛选条件。

**知识小结：** filter 改变元素集合，map 改变元素值，sum 汇总最终元素。

### 泛型

#### J03-008 · 单选 · 基础

下面哪项关于 List<Integer> 与 List<Number> 的关系正确？

A. List<Integer> 可以直接赋给 List<Number>
B. List<Number> 可以直接赋给 List<Integer>
C. 两者是不兼容的不同参数化类型
D. 只有使用原始类型才能编译

**参考答案：** C

**解析：** Java 泛型默认是不变的。Integer 是 Number 的子类，并不意味着 List<Integer> 是 List<Number> 的子类。需要通过通配符表达受限的协变读取。

- A：不成立，会允许向 List<Number> 添加 Double，破坏原列表类型安全。
- B：同样不成立。
- C：正确：两种泛型实参不同，不能直接赋值。
- D：原始类型会丢失类型安全，不是唯一解决方案。

**易错点：** 不要把元素类型的继承关系直接套用到泛型容器。

**知识小结：** Java 泛型类型默认不变。

### 集合

#### J03-009 · 单选 · 基础

`List.of(1, 2)` 返回的列表有什么限制？

A. 不可修改，且不能包含 null
B. 总是由 ArrayList 实现
C. 内容会自动排序
D. 可添加元素但不能删除

**参考答案：** A

**解析：** List.of 创建不可修改列表，且会拒绝 null 元素。

**易错点：** 不可修改列表与可修改副本是不同对象策略。

**知识小结：** 明确列表是只读快照还是可变工作集合。

#### J03-010 · 单选 · 基础

`Arrays.asList(array)` 返回的列表具有什么特性？

A. 自动使用 Set 消除重复
B. 固定大小，元素位置与原数组相互关联
C. 按字典序对数组排序
D. 可任意增删且完全复制数组

**参考答案：** B

**解析：** Arrays.asList 使用给定数组支持固定大小列表，set 可更新对应数组槽位。

**易错点：** add 与 remove 会改变大小，因此通常不支持。

**知识小结：** 需要独立可变列表时可用 `new ArrayList<>(...)`。

#### J03-011 · 多选 · 巩固

关于 List，哪些说法正确？

A. `ArrayList` 的 `add` 通常会追加到末尾
B. List 可以包含重复元素
C. `List.of` 创建的列表支持 set
D. List 允许按索引访问元素

**参考答案：** A、B、D

**解析：** List 保留位置次序且允许重复；ArrayList 的常见 add 会追加元素。

**易错点：** 接口 List 不代表某一具体可变性实现。

**知识小结：** 调用修改操作前确认实际列表实现是否可变。

#### J03-012 · 多选 · 巩固

关于 `List<Integer>` 中的删除重载，哪些描述正确？

A. `remove(1)` 选择按索引删除
B. 若列表为空，`remove(1)` 会抛 IndexOutOfBoundsException
C. 两个写法都一定删除值为 1 的元素
D. `remove(Integer.valueOf(1))` 选择按对象删除

**参考答案：** A、B、D

**解析：** remove(int) 删除索引；remove(Object) 删除首次匹配对象。

**易错点：** 基本类型实参 1 优先匹配 int 索引重载。

**知识小结：** 泛型包装类型列表里，明确对象删除时写出 Integer.valueOf。

#### J03-013 · 代码输出 · 巩固

最终列表是什么？

```java
var items = new java.util.ArrayList<>(java.util.List.of(2, 4));
items.add(6);
items.set(0, 1);
System.out.println(items);
```

**参考答案**

```text
[1, 4, 6]
```

**解析：** 先复制为可变 ArrayList，再追加 6 并把索引 0 替换为 1。

**易错点：** List.of 本身不可修改，外层 ArrayList 才能增删。

**知识小结：** 追踪列表操作时记录每次索引和值的变化。

#### J03-014 · 代码输出 · 巩固

数组和列表依次输出什么？

```java
Integer[] values = {1, 2};
var view = java.util.Arrays.asList(values);
view.set(0, 9);
System.out.println(values[0] + ":" + view.size());
```

**参考答案**

```text
9:2
```

**解析：** Arrays.asList 的固定大小视图共享原数组槽位；set 改变 values[0]。

**易错点：** 视图允许替换元素，但不能改变列表长度。

**知识小结：** 明确区分视图与复制。

#### J03-015 · 代码纠错 · 综合

为什么 `add` 会抛 UnsupportedOperationException？

```java
List<String> names = List.of("Ada");
names.add("Lin");
```

**参考答案：** 改用 `new ArrayList<>(List.of("Ada"))` 创建可变列表后再添加。

**解析：** List.of 返回不可修改列表，静态类型 List 不保证可变。

**易错点：** UnsupportedOperationException 是实现不支持该可选操作的信号。

**知识小结：** 容器类型声明不能说明它是否可变。

#### J03-016 · 代码纠错 · 综合

怎样既保留 Arrays.asList 的元素，又能增删？

```java
var fixed = java.util.Arrays.asList("a", "b");
fixed.add("c");
```

**参考答案：** 复制到新 ArrayList：`var editable = new ArrayList<>(fixed); editable.add("c");`。

**解析：** Arrays.asList 返回固定大小列表，不能通过 add 扩容。

**易错点：** 直接修改该视图的既有元素仍会反映到支持它的数组。

**知识小结：** 对外部数组视图先复制，再执行结构性修改。

#### J03-017 · 单选 · 巩固

HashSet 判断两个普通对象是否重复时主要依赖什么？

A. 只比较 toString 输出
B. 总按插入顺序比较
C. 先比较 hashCode，再在同桶候选间使用 equals
D. 只比较对象的内存地址文本

**参考答案：** C

**解析：** 哈希集合通过 hashCode 定位候选，再用 equals 判断相等性。

**易错点：** hashCode 相同并不保证 equals 为 true。

**知识小结：** 自定义集合元素应正确实现 equals 与 hashCode。

#### J03-018 · 单选 · 巩固

需要稳定保留插入顺序的 Set，常用哪种实现？

A. TreeSet
B. IdentityHashMap
C. HashSet
D. LinkedHashSet

**参考答案：** D

**解析：** LinkedHashSet 维护插入顺序；HashSet 不承诺迭代顺序，TreeSet 按排序规则迭代。

**易错点：** Set 接口本身不承诺具体遍历顺序。

**知识小结：** 根据顺序需求选择实现，而非依赖偶然观察到的顺序。

#### J03-019 · 多选 · 巩固

关于 Set，哪些描述正确？

A. HashSet 承诺按插入顺序迭代
B. Set 通常不允许按 equals 相等的元素重复出现
C. LinkedHashSet 维护可预测的插入迭代顺序
D. TreeSet 通常依据比较器或自然顺序确定唯一性

**参考答案：** B、C、D

**解析：** TreeSet 通过排序比较确定元素组织；LinkedHashSet 保留插入顺序。

**易错点：** HashSet 不保证迭代顺序。

**知识小结：** 需要稳定顺序时把要求写在实现选择中。

#### J03-020 · 多选 · 巩固

向 HashSet 存放自定义对象时，哪些做法可靠？

A. 只重写 toString 即可定义去重规则
B. 对象存入后修改参与哈希的字段可能破坏查找
C. 为值相等的对象实现一致的 equals 和 hashCode
D. 哈希碰撞后集合还会用 equals 区分对象

**参考答案：** B、C、D

**解析：** HashSet 同时使用散列和相等性；参与两者的状态应稳定。

**易错点：** toString 仅用于文本表示，不定义对象相等性。

**知识小结：** 优先使用不可变的集合键对象。

#### J03-021 · 代码输出 · 基础

集合大小是多少？

```java
var values = new java.util.HashSet<>(java.util.List.of(2, 2, 3, 3, 3));
System.out.println(values.size());
```

**参考答案**

```text
2
```

**解析：** Set 保留唯一元素 2 和 3。

**易错点：** 输入列表中的重复项不会成为集合中的重复元素。

**知识小结：** Set size 反映相等性规则下的不同元素数。

#### J03-022 · 代码输出 · 巩固

程序按什么顺序输出？

```java
var values = new java.util.LinkedHashSet<>(java.util.List.of("b", "a", "b", "c"));
System.out.println(values);
```

**参考答案**

```text
[b, a, c]
```

**解析：** 重复的第二个 b 不再插入，剩余元素按首次插入顺序迭代。

**易错点：** 去重不会把元素按字母排序。

**知识小结：** 需要排序时选用 TreeSet 或显式排序。

#### J03-023 · 代码纠错 · 综合

Key 的 equals/hashCode 均依赖 id。修改 id 后，为什么 set.contains(key) 可能返回 false？

```java
class Key { int id; Key(int id) { this.id = id; }
    @Override public boolean equals(Object o) { return o instanceof Key k && id == k.id; }
    @Override public int hashCode() { return id; } }
var set = new java.util.HashSet<Key>();
Key key = new Key(1);
set.add(key);
key.id = 2;
System.out.println(set.contains(key));
```

**参考答案：** 不要修改参与 equals/hashCode 的字段；可使用不可变 Key，或在修改前先 remove，修改后再 add。

**解析：** 修改 id 后 hashCode 变化，元素仍在旧桶中。

**易错点：** 即使同一对象引用，哈希桶定位也可能与当前哈希值不一致。

**知识小结：** 哈希集合中的键在驻留期间保持相等性状态不变。

#### J03-024 · 代码纠错 · 综合

怎样让这个 Set 按字母顺序迭代？

```java
var tags = new java.util.HashSet<>(java.util.List.of("z", "a", "m"));
```

**参考答案：** 使用 `new TreeSet<>(tags)`，或将元素复制到列表后排序。

**解析：** HashSet 不承诺稳定或自然排序顺序。

**易错点：** 偶然出现的某次迭代顺序不能作为契约。

**知识小结：** 将排序需求交给有序容器或显式排序操作。

### Map

#### J03-025 · 单选 · 巩固

调用 `map.get(key)` 返回 null，可能表示什么？

A. 键不存在，或键存在但映射到 null（若该实现允许 null）
B. 必然抛出异常
C. 一定表示键存在且值是 null
D. 一定表示 Map 为空

**参考答案：** A

**解析：** get 返回 null 时通常无法单独区分不存在和映射为 null，可用 containsKey 判断。

**易错点：** 不同 Map 实现对 null 键和值的支持不同。

**知识小结：** 对可能存在空值的映射先检查 containsKey。

#### J03-026 · 单选 · 巩固

`Map.merge(key, value, remappingFunction)` 常用于什么？

A. 删除所有 null 值
B. 键缺失时加入给定值，已存在时按函数合并
C. 把 Map 按键排序
D. 总是无条件覆盖成 value

**参考答案：** B

**解析：** merge 对缺失或 null 映射建立值，对已有非 null 值执行合并函数。

**易错点：** 合并函数返回 null 时会删除该映射。

**知识小结：** 计数累加常用 `merge(key, 1, Integer::sum)`。

#### J03-027 · 多选 · 巩固

关于 Map，哪些说法正确？

A. 一个键最多映射到一个值
B. `put` 返回该键先前映射的值
C. Map 的所有实现都允许 null 键
D. `containsKey` 可区分不存在与映射到 null 的键

**参考答案：** A、B、D

**解析：** Map 以键唯一性组织映射，put 可返回旧值，containsKey 可判断键是否存在。

**易错点：** 例如 ConcurrentHashMap 不允许 null 键和值。

**知识小结：** 阅读具体实现契约，不要假设接口所有实现支持相同 null 策略。

#### J03-028 · 多选 · 巩固

关于 HashMap 遍历，哪些说法正确？

A. 普通 HashMap 不保证迭代顺序
B. 遍历时对 Map 结构性修改通常安全且受支持
C. 按键排序需要显式选用有序 Map 或排序键
D. 可以遍历 `entrySet()` 同时取得键和值

**参考答案：** A、C、D

**解析：** entrySet 能直接读取键值对；HashMap 不提供排序保证。

**易错点：** 结构性修改可能触发 fail-fast 检测，应使用迭代器 remove 或并发设计。

**知识小结：** 迭代顺序和并发修改都应按集合契约处理。

#### J03-029 · 代码输出 · 巩固

键 `java` 对应的累计值是多少？

```java
var counts = new java.util.HashMap<String, Integer>();
counts.merge("java", 1, Integer::sum);
counts.merge("java", 1, Integer::sum);
System.out.println(counts.get("java"));
```

**参考答案**

```text
2
```

**解析：** 第一次 merge 建立计数 1，第二次用 Integer::sum 合并为 2。

**易错点：** 键第一次出现时不会调用已有值合并函数。

**知识小结：** merge 简化存在则更新、缺失则初始化的计数逻辑。

#### J03-030 · 代码输出 · 巩固

输出结果是什么？

```java
var map = new java.util.LinkedHashMap<String, Integer>();
map.put("x", 1); map.put("y", 2); map.put("x", 3);
System.out.println(map);
```

**参考答案**

```text
{x=3, y=2}
```

**解析：** 更新 x 的值不会重新插入键，插入顺序仍为 x 后 y。

**易错点：** LinkedHashMap 默认保持插入顺序；访问顺序模式需另行配置。

**知识小结：** 更新映射值与改变键迭代位置要分别判断。

#### J03-031 · 代码纠错 · 综合

为什么这段代码在缺失键时会发生空指针异常？

```java
Integer count = counts.get("missing");
int next = count + 1;
```

**参考答案：** 先用 `getOrDefault("missing", 0)`，或使用 merge/computeIfAbsent 初始化。

**解析：** 键不存在时 get 返回 null，自动拆箱会触发 NullPointerException。

**易错点：** 包装类型可能为 null，拆箱前应确认值存在。

**知识小结：** 用 getOrDefault 表达缺失映射的默认值。

#### J03-032 · 代码纠错 · 综合

怎样在保留 Map 的同时安全删除所有值为负数的映射？

```java
for (var entry : map.entrySet()) {
    if (entry.getValue() < 0) map.remove(entry.getKey());
}
```

**参考答案：** 使用 `map.entrySet().removeIf(entry -> entry.getValue() < 0);`，或通过 Iterator.remove 删除。

**解析：** 增强 for 遍历期间直接结构性修改 Map 可能触发 ConcurrentModificationException。

**易错点：** fail-fast 是错误检测机制，不提供并发安全保证。

**知识小结：** 通过当前迭代器或集合视图支持的删除操作修改结构。

### 泛型

#### J03-033 · 单选 · 巩固

为什么不能把 `List<Integer>` 赋给 `List<Number>`？

A. 泛型只适用于数组
B. Integer 不是 Number 的子类
C. 泛型默认是不变的，避免通过 List<Number> 写入 Double 到 Integer 列表
D. List 不能使用引用类型

**参考答案：** C

**解析：** Integer 是 Number 子类，但 List<Integer> 并不是 List<Number> 子类。

**易错点：** 若允许协变赋值，接收端就可能写入不匹配的元素。

**知识小结：** 区分元素类型继承关系和参数化容器类型关系。

#### J03-034 · 单选 · 巩固

方法只需要读取 Number 列表中的元素，常用哪种参数？

A. `List<? super Integer>` 并把读出值当 Integer
B. `List<?>` 并允许写入 Double
C. `List<Number>`
D. `List<? extends Number>`

**参考答案：** D

**解析：** 上界通配符表示元素类型是 Number 或其子类型，适合从集合读取 Number。

**易错点：** 通过 extends 声明上界，不意味着集合只含直接的 Number。

**知识小结：** 生产者用 extends：从源集合取值。

#### J03-035 · 多选 · 巩固

关于通配符，哪些说法正确？

A. 从 `List<? extends Number>` 中可直接添加 Integer
B. `List<?>` 可读取元素为 Object
C. `? extends T` 适合读取为 T
D. `? super T` 可以安全写入 T

**参考答案：** B、C、D

**解析：** 上界可安全读为 T；下界可安全写入 T；未知类型集合读取只能保证为 Object。

**易错点：** extends 集合的具体子类型未知，通常不能安全添加非 null 值。

**知识小结：** PECS：生产者用 extends，消费者用 super。

#### J03-036 · 多选 · 巩固

以下哪些设计符合泛型规则？

A. `List<String>` 与 `List<Integer>` 在运行时通常共用擦除后的 List 类
B. 方法可声明自己的类型参数 `<T> T first(List<T> values)`
C. `List<String>` 可以安全当作 `List<Object>`
D. 限定参数可以写成 `<T extends Number>`

**参考答案：** A、B、D

**解析：** 类型参数可在方法或类声明；T 可受边界约束，运行时采用类型擦除。

**易错点：** 泛型不变，String 列表不是 Object 列表。

**知识小结：** 避免向参数化列表写入运行时不匹配元素。

#### J03-037 · 代码输出 · 巩固

编译器将 T 推断为 String 后，程序打印什么？

```java
static <T> T first(java.util.List<T> items) { return items.get(0); }
String name = first(java.util.List.of("A", "B"));
System.out.println(name);
```

**参考答案**

```text
A
```

**解析：** 实参列表的元素类型为 String，类型参数 T 推断为 String，返回首元素 A。

**易错点：** 泛型提供编译期类型关系，不需要在调用处强转。

**知识小结：** 沿着实参类型跟踪类型参数推断。

#### J03-038 · 代码输出 · 巩固

下面读取到的值是什么？

```java
static double total(java.util.List<? extends Number> xs) { return xs.get(0).doubleValue(); }
System.out.println(total(java.util.List.of(3)));
```

**参考答案**

```text
3.0
```

**解析：** 列表元素类型是 Integer，Integer 继承 Number 并提供 doubleValue。

**易错点：** 上界通配符适用于读取，不代表可以添加任意 Number。

**知识小结：** 对多个数值子类型统一读取时使用 Number 上界。

#### J03-039 · 代码纠错 · 综合

为什么无法把这个 List 传给方法？

```java
static void print(java.util.List<Number> values) {}
java.util.List<Integer> ints = java.util.List.of(1, 2);
print(ints);
```

**参考答案：** 若只读取，参数改为 `List<? extends Number>`；若要写入不同 Number，创建 `List<Number>`。

**解析：** List<Integer> 与 List<Number> 泛型不变，不能直接赋值。

**易错点：** 把集合当作只读源或可写目标后，再设计通配符方向。

**知识小结：** 用 PECS 规则表达调用方的读取或写入意图。

#### J03-040 · 代码纠错 · 综合

为什么不能重载这两个方法？

```java
void show(java.util.List<String> values) {}
void show(java.util.List<Integer> values) {}
```

**参考答案：** 改为不同方法名，或使用不同的可区分参数列表；两者擦除后签名冲突。

**解析：** 泛型类型实参在运行时擦除，两种签名都会变成 show(List)。

**易错点：** 不能依赖运行时泛型参数来区分方法重载。

**知识小结：** 检查擦除后的方法签名是否相同。

### Stream

#### J03-041 · 单选 · 巩固

Stream 中间操作（如 filter、map）通常何时执行？

A. 遇到终端操作时惰性执行
B. 调用 filter 的瞬间立刻遍历全部元素
C. 只在关闭 Stream 时执行
D. 每次创建 Stream 都自动保存到集合

**参考答案：** A

**解析：** 中间操作构建流水线；终端操作触发遍历与计算。

**易错点：** 若没有终端操作，通常不会执行实际遍历。

**知识小结：** 先构造 transformation，再用 collect、count 或 forEach 结束。

#### J03-042 · 单选 · 巩固

要把 `List<List<T>>` 转为一个元素流，最合适的操作通常是什么？

A. filter
B. flatMap
C. peek
D. distinct

**参考答案：** B

**解析：** flatMap 把每个输入映射为流，再将这些流合并成单层流。

**易错点：** map 会保留嵌套层次，结果可能是 Stream<Stream<T>>。

**知识小结：** 将一对多映射展平时使用 flatMap。

#### J03-043 · 多选 · 巩固

关于 Stream，哪些说法正确？

A. 调用 sorted 后原始 List 一定被原地排序
B. count 是终端操作
C. filter 和 map 是中间操作
D. 同一 Stream 通常只能消费一次

**参考答案：** B、C、D

**解析：** Stream 具有一次性流水线；中间操作组合，终端操作触发求值。

**易错点：** Stream 排序产生流水线结果，不修改源 List。

**知识小结：** 需要原地排序时使用集合排序 API。

#### J03-044 · 多选 · 巩固

关于 Stream 遍历顺序与状态，哪些说法正确？

A. 有序流的 forEachOrdered 会按遇到顺序执行动作
B. Stream API 保证任意有副作用流水线结果确定
C. 无状态的 map/filter 通常更容易并行处理
D. 在并行流 lambda 中修改共享 ArrayList 通常不安全

**参考答案：** A、C、D

**解析：** 顺序语义与共享状态很重要；无状态操作更适合并行分段执行。

**易错点：** 外部共享副作用会引入竞态和不可预测顺序。

**知识小结：** 优先写无副作用转换，终端收集由框架管理。

#### J03-045 · 代码输出 · 基础

结果列表是什么？

```java
var result = java.util.List.of(1, 2, 3, 4).stream()
    .filter(n -> n % 2 == 0).map(n -> n * 10).toList();
System.out.println(result);
```

**参考答案**

```text
[20, 40]
```

**解析：** filter 保留偶数 2、4，map 将其乘 10。

**易错点：** toList 返回的列表不可修改。

**知识小结：** 按流水线顺序追踪每个元素经过的操作。

#### J03-046 · 代码输出 · 巩固

count 的结果是多少？

```java
long count = java.util.List.of("a", "ab", "b").stream()
    .filter(s -> s.length() == 1).count();
System.out.println(count);
```

**参考答案**

```text
2
```

**解析：** 长度为 1 的元素有 a 和 b，共两个。

**易错点：** count 是终端操作，运行后该 Stream 不能再次使用。

**知识小结：** 把中间筛选条件转成逐元素判断。

#### J03-047 · 代码纠错 · 巩固

为什么这个 Stream 第二次终端操作会抛 IllegalStateException？

```java
var stream = java.util.List.of(1, 2).stream();
long count = stream.count();
stream.forEach(System.out::println);
```

**参考答案：** 为第二个终端操作新建 Stream，例如再次使用 `java.util.List.of(1, 2).stream().forEach(System.out::println)`。

**解析：** 终端操作已消费 stream，Stream 不可复用。

**易错点：** 保存源集合，而不是缓存已经消费的流。

**知识小结：** 每条流水线只执行一次。

#### J03-048 · 代码纠错 · 巩固

为什么没有打印任何内容？

```java
java.util.List.of(1, 2, 3).stream()
    .peek(System.out::println);
```

**参考答案：** 追加终端操作，例如 `.forEach(System.out::println)`，或收集结果。

**解析：** peek 是中间操作，不会自行触发 Stream 求值。

**易错点：** 调试时不要把 peek 当作终端输出操作。

**知识小结：** 流水线必须由终端操作启动。

#### J03-049 · 单选 · 巩固

`Collectors.groupingBy(classifier, counting())` 的结果通常是什么？

A. 只保留第一个元素的 List
B. 按键自然排序的 Set
C. 按分类键映射到 Long 计数的 Map
D. 一个不可重复消费的 Stream

**参考答案：** C

**解析：** groupingBy 按 classifier 的结果分组，counting 为每组计算元素数。

**易错点：** 分组 Map 的具体实现及顺序应查看 API 契约，不要假设排序。

**知识小结：** 聚合目标是分类统计时用 groupingBy 配合下游 collector。

#### J03-050 · 单选 · 巩固

没有初始值的 `Stream.reduce` 为什么通常返回 Optional？

A. reduce 只能处理引用类型
B. Optional 表示结果一定是 null
C. 并行流不支持直接返回值
D. 流可能为空，无法确定累积结果

**参考答案：** D

**解析：** 无初始值 reduce 在空流上没有结果，因此用 Optional 表示可能不存在。

**易错点：** 带 identity 的 reduce 在空流上可返回 identity。

**知识小结：** 选择 reduce 重载时明确空流语义。

#### J03-051 · 多选 · 巩固

关于排序与去重，哪些说法正确？

A. distinct 使用元素的 equals 判断重复
B. sorted 可以接受 Comparator
C. Comparator.comparing 可按对象属性构造比较器
D. Stream.sorted 会原地修改源集合

**参考答案：** A、B、C

**解析：** Stream distinct 依赖相等性，sorted 通过自然顺序或比较器产生排序流。

**易错点：** 集合源不会因 Stream sorted 被直接修改。

**知识小结：** 选择比较键时确认 null 值和相同排序键的处理。

#### J03-052 · 多选 · 巩固

使用 collector 汇总时，哪些做法合理？

A. `Collectors.toMap` 遇到重复键时若无合并函数可能抛异常
B. `Collectors.joining(",")` 可连接字符串流
C. `Collectors.toList()` 收集流元素到 List
D. 任何 Collector 都保证返回的集合可变且线程安全

**参考答案：** A、B、C

**解析：** 不同 collector 表达不同终结汇总；toMap 重复键需明确合并策略。

**易错点：** 返回集合的可变性和并发保证依 collector 而定。

**知识小结：** 处理可能重复的键时提供 merge function。

#### J03-053 · 代码输出 · 巩固

按长度分组后的 key 2 对应多少元素？

```java
var grouped = java.util.List.of("a", "bc", "de", "f").stream()
    .collect(java.util.stream.Collectors.groupingBy(String::length, java.util.stream.Collectors.counting()));
System.out.println(grouped.get(2));
```

**参考答案**

```text
2
```

**解析：** 长度为 2 的字符串有 bc 和 de。

**易错点：** counting 的统计结果类型为 Long。

**知识小结：** 先确定分类键，再统计每组元素数。

#### J03-054 · 代码输出 · 巩固

连接后的字符串是什么？

```java
String result = java.util.List.of("A", "B", "C").stream()
    .collect(java.util.stream.Collectors.joining("-"));
System.out.println(result);
```

**参考答案**

```text
A-B-C
```

**解析：** joining 以连字符把流中三个字符串按遇到顺序连接。

**易错点：** 遇到顺序只有在有序源与对应操作中才有确定意义。

**知识小结：** 格式化拼接比在 forEach 中修改共享 StringBuilder 更清晰。

#### J03-055 · 代码纠错 · 综合

为什么 toMap 无法决定相同首字母的值？如何保留较长字符串？

```java
var map = java.util.List.of("ant", "apple").stream()
    .collect(java.util.stream.Collectors.toMap(s -> s.substring(0, 1), s -> s));
```

**参考答案：** 给 toMap 增加合并函数，例如 `(a, b) -> a.length() >= b.length() ? a : b`。

**解析：** 两个元素都映射到键 a，缺少重复键处理策略。

**易错点：** 合并函数参数顺序对应已有值与新值。

**知识小结：** 设计 Map 汇总前先确认键是否唯一。

#### J03-056 · 代码纠错 · 综合

怎样让这个无初始值求和在空流时也返回 0？

```java
int total = values.stream().mapToInt(Integer::intValue).reduce((a, b) -> a + b).getAsInt();
```

**参考答案：** 使用 `sum()`，或给 reduce 提供 identity：`.reduce(0, Integer::sum)`。

**解析：** 空流的无初始值 reduce 返回空 OptionalInt，直接取值会抛异常。

**易错点：** 在访问 Optional 前处理空值路径。

**知识小结：** 存在自然单位元时，用带 identity 的归约表达空输入结果。

### 泛型

#### J03-057 · 单选 · 巩固

一个普通函数式接口最多可以有几个抽象方法？

A. 一个；Object 的公共方法签名不计为额外抽象方法
B. 必须为零个
C. 必须正好两个
D. 任意多个，只要有 default 方法

**参考答案：** A

**解析：** 函数式接口只有一个函数描述符，可通过 @FunctionalInterface 请求编译器检查。

**易错点：** 它仍可以有 default、static 或 Object 方法签名。

**知识小结：** 把单一行为契约交给 lambda 表达。

#### J03-058 · 单选 · 巩固

`Optional.map(f)` 中 f 返回 null 时通常怎样处理？

A. 抛出 NullPointerException
B. 结果成为 Optional.empty()
C. 自动创建空字符串
D. Optional 直接保存 null

**参考答案：** B

**解析：** 若 Optional 有值，map 会将映射结果包装；结果为 null 时转为空 Optional。

**易错点：** Optional 本身不允许表示“有值且为 null”。

**知识小结：** 对返回 Optional 的函数使用 flatMap 避免嵌套。

#### J03-059 · 多选 · 巩固

关于 Optional，哪些说法正确？

A. `orElse` 的参数表达式会先被求值
B. `orElseGet` 可在值缺失时延迟调用 supplier
C. `Optional.of(null)` 返回 empty
D. `Optional.ofNullable(null)` 返回 empty

**参考答案：** A、B、D

**解析：** orElse 会预先计算参数；orElseGet 按需调用；ofNullable 可接收 null。

**易错点：** Optional.of(null) 会抛 NullPointerException。

**知识小结：** 默认值计算昂贵或有副作用时使用 orElseGet。

#### J03-060 · 多选 · 巩固

关于 lambda，哪些描述正确？

A. lambda 读取的局部变量需为 final 或 effectively final
B. lambda 总是创建一个新线程
C. 方法引用可简写某些直接转发参数的 lambda
D. lambda 需要目标函数式接口类型

**参考答案：** A、C、D

**解析：** lambda 通过目标类型确定函数签名，捕获局部变量要求不再重新赋值。

**易错点：** lambda 描述行为，不会自动启动线程。

**知识小结：** 区分行为对象、执行线程和执行时机。

#### J03-061 · 代码输出 · 巩固

输出什么？

```java
java.util.Optional<String> name = java.util.Optional.of("Ada");
System.out.println(name.map(String::toUpperCase).orElse("N/A"));
```

**参考答案**

```text
ADA
```

**解析：** Optional 有值时执行 map，将字符串转换为大写；orElse 返回该值。

**易错点：** map 不会修改原字符串。

**知识小结：** 使用 Optional 管理可缺失值时保持链式转换明确。

#### J03-062 · 代码输出 · 巩固

程序打印什么？

```java
int value = java.util.Optional.of(7).orElseGet(() -> { System.out.println("fallback"); return 0; });
System.out.println(value);
```

**参考答案**

```text
7
```

**解析：** Optional 已有值，因此 supplier 不执行，只输出 7。

**易错点：** orElseGet 的 supplier 仅在空 Optional 时调用。

**知识小结：** 懒加载默认值时可用 orElseGet。

#### J03-063 · 代码纠错 · 综合

为什么捕获的 count 无法编译？

```java
int count = 0;
Runnable task = () -> System.out.println(count);
count++;
```

**参考答案：** 移除后续对 count 的重新赋值，或先把值复制到一个不会再变更的局部变量。

**解析：** 被 lambda 捕获的局部变量必须 final 或 effectively final。

**易错点：** 局部变量捕获并不会自动形成可变闭包单元。

**知识小结：** 把需要共享的可变状态放到明确的对象或并发容器中。

#### J03-064 · 代码纠错 · 巩固

为什么 Optional.of 这一行抛出异常？应按可空输入怎样包装？

```java
String value = null;
var wrapped = java.util.Optional.of(value);
```

**参考答案：** 将 `of` 改为 `Optional.ofNullable(value)`。

**解析：** Optional.of 要求参数非 null。

**易错点：** 若 null 表示程序错误，of 的异常也可能是有意校验。

**知识小结：** 明确区分禁止 null 和允许缺失两种契约。

### 集合

#### J03-065 · 单选 · 巩固

Comparator 的 `compare(a, b)` 返回负数通常意味着什么？

A. a 必须为空
B. 比较结果只允许是 -1、0、1
C. a 在排序顺序中排在 b 前面
D. a 与 b 必须是同一对象

**参考答案：** C

**解析：** Comparator 只规定负、零、正的意义，不要求返回值恰为 -1、0、1。

**易错点：** 比较器应满足一致性与传递性。

**知识小结：** 将排序关系读成负、零、正，而不是精确数字。

#### J03-066 · 单选 · 巩固

要按分数降序、同分时按姓名升序，通常怎样组合比较器？

A. 把两个比较器用逻辑或连接
B. 对分数调用 hashCode 排序
C. 先按姓名降序，再按分数升序
D. 先比较分数的降序比较器，再 thenComparing 姓名升序

**参考答案：** D

**解析：** 主键排序为 score reversed，随后以姓名升序作为次级键。

**易错点：** 反转整个组合与只反转主比较器可能得到不同顺序。

**知识小结：** 先明确主排序方向，再追加稳定的次级比较键。

#### J03-067 · 多选 · 巩固

构造 Comparator 时哪些做法合理？

A. 用 `a.age - b.age` 比较可能发生整数溢出
B. Comparator 必须修改被排序对象才能排序
C. `Comparator.comparing(Person::name)` 按名称比较
D. `thenComparingInt(Person::age)` 添加整数次级排序

**参考答案：** A、C、D

**解析：** comparing 与 thenComparing 组合键；减法比较可能溢出，应改用 Integer.compare。

**易错点：** 排序比较器通常只描述次序，不应修改对象。

**知识小结：** 使用 compare / comparing API 避免减法溢出。

#### J03-068 · 多选 · 巩固

关于排序，哪些说法正确？

A. HashMap 的 keySet 天然按键排序
B. List.sort 可原地排序列表
C. Stream.sorted 生成排序后的流结果，不会原地重排源 List
D. 比较器若对不等价关系自相矛盾，排序可能失败或结果不可靠

**参考答案：** B、C、D

**解析：** List.sort 修改列表顺序；Stream.sorted 处理流水线；比较器应维持传递一致性。

**易错点：** HashMap 不提供排序保证。

**知识小结：** 排序契约是比较函数需要遵循的逻辑，而非仅提供任意数字。

#### J03-069 · 代码输出 · 巩固

排序后的数字列表是什么？

```java
var values = new java.util.ArrayList<>(java.util.List.of(9, 2, 5));
values.sort(java.util.Comparator.naturalOrder());
System.out.println(values);
```

**参考答案**

```text
[2, 5, 9]
```

**解析：** naturalOrder 按整数自然升序排列列表本身。

**易错点：** List.sort 会修改这个列表。

**知识小结：** 需要保留原顺序时先复制或用 Stream.sorted。

#### J03-070 · 代码输出 · 巩固

下面姓名的排序顺序是什么？

```java
var names = java.util.List.of("Bob", "Al", "Eve").stream()
    .sorted(java.util.Comparator.comparingInt(String::length).thenComparing(java.util.Comparator.naturalOrder())).toList();
System.out.println(names);
```

**参考答案**

```text
[Al, Bob, Eve]
```

**解析：** 先按长度升序，再对同长度姓名按自然字母顺序比较。

**易错点：** 次级比较器只在主要键相等时生效。

**知识小结：** 复合排序时明确每一级键的顺序与方向。

#### J03-071 · 代码纠错 · 综合

以下排序代码使用 int 字段 age。如何避免相减比较时溢出？

```java
people.sort((a, b) -> a.age - b.age);
```

**参考答案：** 改为 `people.sort((a, b) -> Integer.compare(a.age, b.age))`。

**解析：** 当 age 值接近 int 极值时，减法可能溢出并破坏排序关系。

**易错点：** 错误比较器可能违反传递性并造成不可预测排序。

**知识小结：** 不要用相减作为通用数值比较。

#### J03-072 · 代码纠错 · 综合

为什么姓名相同时无法按年龄排列？怎样加入第二排序键？

```java
people.sort(java.util.Comparator.comparing(Person::name));
```

**参考答案：** 追加 `.thenComparingInt(Person::age)`。

**解析：** 现有比较器只看 name，同名对象比较结果为 0。

**易错点：** 排序稳定时同键元素会维持原相对顺序，但这不等于按年龄排序。

**知识小结：** 将每个业务排序条件都写入比较器组合。

### IO

#### J03-073 · 单选 · 巩固

读取文本文件时显式指定 UTF-8 的好处是什么？

A. 避免依赖运行环境默认字符集，跨环境解释一致
B. 保证文件一定存在
C. 让所有文件都变成二进制格式
D. 自动去除文件中的换行

**参考答案：** A

**解析：** 明确字符集使字节到字符的解码规则稳定。

**易错点：** 编码选择不能替代文件存在性与权限检查。

**知识小结：** 文本 IO 在边界处明确指定 charset。

#### J03-074 · 单选 · 巩固

`Path.resolve("child.txt")` 通常用于什么？

A. 检查用户是否有写权限
B. 在路径对象基础上解析一个子路径
C. 马上读取文件所有内容
D. 删除目标目录

**参考答案：** B

**解析：** resolve 组合路径片段并返回 Path，不执行文件读写。

**易错点：** 路径拼接与 IO 操作是分离步骤。

**知识小结：** 构造 Path 后仍需检查或调用相应文件 API。

#### J03-075 · 多选 · 巩固

关于 Files 的文本 API，哪些说法正确？

A. 文件 IO 可能抛出 IOException
B. 文件不存在时 readString 会返回空字符串
C. `Files.writeString` 可将文本写入路径
D. `Files.readString(path, UTF_8)` 返回文件全部文本

**参考答案：** A、C、D

**解析：** readString / writeString 是文本便利 API，读取失败会以 IO 异常报告。

**易错点：** 不存在与空文件是两种不同状态。

**知识小结：** 调用处应声明或处理受检 IO 异常。

#### J03-076 · 多选 · 巩固

关于 Path 与文件操作，哪些说法正确？

A. Path 本身是路径表示，不一定对应存在的文件
B. 使用 try-with-resources 管理打开的 Reader
C. `resolve` 总会规范化并消除所有 `..`
D. `Files.exists(path)` 可检查路径当前是否存在，但结果会随时间变化

**参考答案：** A、B、D

**解析：** Path 只描述位置；exists 是瞬时检查，打开 reader 后需关闭资源。

**易错点：** 文件系统在检查和使用之间可能变化；resolve 也不保证执行规范化。

**知识小结：** 用实际 IO 操作处理竞态，并妥善管理资源。

#### J03-077 · 代码输出 · 巩固

UTF-8 编码后这个字符占多少字节？

```java
byte[] bytes = "猫".getBytes(java.nio.charset.StandardCharsets.UTF_8);
System.out.println(bytes.length);
```

**参考答案**

```text
3
```

**解析：** 猫的 UTF-8 编码由三个字节组成。

**易错点：** String.length 计算 UTF-16 代码单元数，与编码后的字节数不同。

**知识小结：** 网络与文件长度应根据具体字符编码计算。

#### J03-078 · 代码输出 · 巩固

这个路径的文件名部分是什么？

```java
var path = java.nio.file.Path.of("data").resolve("users.csv");
System.out.println(path.getFileName());
```

**参考答案**

```text
users.csv
```

**解析：** resolve 组合父路径和子路径，getFileName 返回最后一个路径部分。

**易错点：** Path 的展示分隔符因平台不同；文件名部分不变。

**知识小结：** 用 Path 的结构化方法查询路径片段。

#### J03-079 · 代码纠错 · 巩固

为什么这个代码在文件不存在时没有拿到空文本？

```java
String text = java.nio.file.Files.readString(java.nio.file.Path.of("missing.txt"));
```

**参考答案：** 捕获或声明 IOException，并根据业务需求创建文件、返回缺失状态或提示用户。

**解析：** readString 对不存在的路径抛出 IOException 子类，不会自动返回空字符串。

**易错点：** 不要把“缺失”误当成“内容长度为零”。

**知识小结：** 让文件缺失成为显式、可处理的业务结果。

#### J03-080 · 代码纠错 · 综合

怎样避免 Writer 在异常路径上泄漏？

```java
var writer = java.nio.file.Files.newBufferedWriter(path);
writer.write(text);
```

**参考答案：** 用 `try (var writer = Files.newBufferedWriter(path)) { writer.write(text); }`。

**解析：** 当前代码没有关闭 writer；缓冲内容或文件描述符可能无法及时释放。

**易错点：** close 也可能抛出 IOException，因此应纳入结构化清理。

**知识小结：** 用 try-with-resources 管理 AutoCloseable IO 资源。

## 深入 · 50 题

### 并发基础

#### J04-001 · 多选 · 综合

对 volatile int count 的 i++，哪些判断正确？

A. volatile 可帮助不同线程看到最新写入
B. i++ 因为有 volatile 就是原子操作
C. i++ 包含读取、计算和写入等步骤
D. 需要原子递增时可以考虑 AtomicInteger

**参考答案：** A、C、D

**解析：** volatile 提供可见性和一定的有序性保证，但不会把复合读改写变成不可分割操作。AtomicInteger 提供原子递增方法。

- A：正确：volatile 写入与后续读取建立可见性保证。
- B：错误：多个线程仍可能读到相同旧值再覆盖写入。
- C：正确：自增不是单一步骤。
- D：正确：原子类提供适合的并发操作。

**易错点：** 把可见性误认为互斥或原子性。

**知识小结：** volatile 适合状态发布；复合更新要用锁或原子类。

#### J04-002 · 代码输出 · 巩固

单线程执行后会输出什么？

```java
AtomicInteger count = new AtomicInteger(0);
int first = count.incrementAndGet();
System.out.println(first + " / " + count.get());
```

**参考答案**

```text
1 / 1
```

**解析：** incrementAndGet 原子地递增并返回更新后的值。首次调用后 count 和 first 都是 1，后续 get 仍得到 1。

**易错点：** incrementAndGet 返回递增后的值；getAndIncrement 返回递增前的值。

**知识小结：** 使用原子类时注意方法名表达的返回时机。

### JVM 内存

#### J04-003 · 单选 · 基础

关于 Java 的线程栈和堆，哪项描述最合适？

A. 所有对象都必须分配在线程栈上
B. 线程执行方法时使用栈帧；对象通常由堆管理
C. 堆为每个线程完全私有
D. 局部变量永远不会出现在栈帧中

**参考答案：** B

**解析：** 每个线程有自己的 Java 虚拟机栈，方法调用创建栈帧。对象和数组通常由堆分配和管理；具体实现可优化分配，但不改变程序可观察语义。

- A：错误：对象通常由堆管理。
- B：正确：这是理解运行时数据区的基础模型。
- C：错误：堆由线程共享。
- D：错误：局部变量表属于栈帧。

**易错点：** 不要把规范中的运行时数据区模型与具体 JIT 的分配优化混为一谈。

**知识小结：** 栈帧与线程关联，堆主要用于对象与数组。

### 集合与并发

#### J04-004 · 代码纠错 · 综合

为什么遍历时直接调用 list.remove 可能抛出 ConcurrentModificationException？推荐怎样删除？

```java
List<String> names = new ArrayList<>(List.of("A", "B", "C", "D"));
for (String name : names) {
    if (name.equals("B")) names.remove(name);
}
```

**参考答案：** 增强 for 使用迭代器遍历；直接对列表做结构修改会使迭代器检测到修改计数不一致。可用 Iterator.remove、removeIf，或构造新的过滤结果。

**解析：** ArrayList 的 fail-fast 检查用于尽早发现迭代期间的非迭代器结构修改。它是错误检测机制，不是线程安全保证。

**易错点：** ConcurrentModificationException 的名字不表示只有多线程才会触发。

**知识小结：** 遍历中删除元素时使用迭代器提供的删除方法或集合的批量操作。

### 并发基础

#### J04-005 · 单选 · 巩固

直接调用一个 Thread 对象的 run() 方法，会创建新线程吗？

A. 会，run 和 start 完全等价
B. 不会，它只是当前线程中的普通方法调用
C. 会，但线程会立即结束
D. 只有在线程池中调用才会创建新线程

**参考答案：** B

**解析：** start 请求 JVM 启动新的执行线程，随后由新线程调用 run。直接调用 run 不启动线程，只在当前调用栈中执行方法体。

- A：错误：只有 start 才启动新的执行流。
- B：正确：run 是普通实例方法。
- C：直接调用 run 时没有新线程可结束。
- D：线程池有自己的提交接口，也不改变 run 的普通方法语义。

**易错点：** 把任务代码入口 run 与线程启动入口 start 混淆。

**知识小结：** 启动 Thread 使用 start；任务提交给 Executor 使用 execute 或 submit。

### JVM 内存

#### J04-006 · 单选 · 巩固

调用一个方法时，通常哪类数据随该次调用创建并随返回而结束？

A. 所有线程的栈
B. 所有堆对象
C. 该调用的栈帧与局部变量
D. 整个类的元数据

**参考答案：** C

**解析：** 每次方法调用创建栈帧，保存局部变量表、操作数栈等；返回时该帧退出。

**易错点：** 局部变量中的引用消失，不代表引用对象一定立刻回收。

**知识小结：** 区分线程栈帧和堆中对象的生命周期。

#### J04-007 · 单选 · 巩固

一个对象不再能从任何 GC Root 到达，通常意味着什么？

A. 它会自动写入磁盘
B. 它必须在下一条语句前销毁
C. JVM 会立即调用对象析构器
D. 它符合被垃圾回收的条件，但回收时间不确定

**参考答案：** D

**解析：** 不可达对象可被垃圾回收器回收，但何时回收没有保证。

**易错点：** Java 不提供确定时刻的析构语义。

**知识小结：** 不要把对象不可达和内存立即释放等同。

#### J04-008 · 多选 · 综合

关于 JVM 内存区域，哪些说法较准确？

A. 对象通常分配在堆中
B. 每个线程拥有自己的 Java 虚拟机栈
C. 类元数据通常由方法区相关运行时区域承载
D. 程序计数器在所有线程间共享一份

**参考答案：** A、B、C

**解析：** 栈与程序计数器具有线程私有属性；堆和类元数据区域由线程共享。

**易错点：** 具体实现可采用不同物理布局，规范描述的是运行时数据区域语义。

**知识小结：** 避免把 JVM 规范区域与某一实现的物理内存布局混为一谈。

#### J04-009 · 多选 · 综合

关于对象引用与可达性，哪些描述正确？

A. GC 必须按 Java 变量名从短到长回收
B. 局部引用变量离开作用域后，其引用值不再从该变量读取
C. 一个对象可以被多个引用指向
D. 对象仍被静态集合强引用时通常保持可达

**参考答案：** B、C、D

**解析：** 对象可共享引用；GC 根据可达性判断，而不是变量名称或词法顺序。

**易错点：** JIT 还可能提前判定局部变量不再存活。

**知识小结：** 检查根引用链，而不是寻找对象创建时的变量名。

#### J04-010 · 代码输出 · 基础

程序输出什么？

```java
int x = 3;
int y = x;
y = 9;
System.out.println(x + ":" + y);
```

**参考答案**

```text
3:9
```

**解析：** 基本类型赋值复制数值；重写 y 不影响 x。

**易错点：** 基本类型和引用类型赋值的对象关系不同。

**知识小结：** 先确认变量保存值还是引用。

#### J04-011 · 代码输出 · 基础

会打印什么？

```java
class Box { int value; }
Box a = new Box();
Box b = a;
b.value = 6;
System.out.println(a.value);
```

**参考答案**

```text
6
```

**解析：** 两个局部变量指向同一个堆对象，通过 b 修改的字段也可由 a 看到。

**易错点：** 局部引用在栈帧中，对象状态通常位于堆中。

**知识小结：** 对象别名共享状态，需要考虑封装。

#### J04-012 · 代码输出 · 基础

代码最后输出什么？

```java
class Node { Node next; }
Node first = new Node();
Node second = new Node();
first.next = second;
first = null;
System.out.println(second != null);
```

**参考答案**

```text
true
```

**解析：** second 仍直接引用第二个 Node；清空 first 不会清掉 second 引用。

**易错点：** 对象是否可达要看所有引用路径。

**知识小结：** 多个引用可以让对象在某个引用消失后仍保持可达。

#### J04-013 · 代码纠错 · 综合

为什么在方法返回后不能再使用方法内的局部变量？

```java
static void run() {
    int local = 3;
}
System.out.println(local);
```

**参考答案：** 把要在调用后使用的值作为返回值返回，或声明在合适的外部作用域。

**解析：** local 只在 run 方法作用域内可见，方法返回时其栈帧退出。

**易错点：** 作用域是语言规则，不能通过堆栈模型绕过。

**知识小结：** 通过参数和返回值显式传递方法数据。

#### J04-014 · 代码纠错 · 综合

为什么清空这个引用后，对象仍可能不能回收？

```java
static Object retained;
Object value = new Object();
retained = value;
value = null;
```

**参考答案：** 同时清除 `retained` 或移除持有它的集合条目；确认不存在其他强引用路径。

**解析：** 静态字段 retained 仍然指向对象，使其从 GC Root 可达。

**易错点：** 只清除一个局部别名不能证明对象不可达。

**知识小结：** 沿着静态字段、线程栈和集合引用追踪可达路径。

### 类加载

#### J04-015 · 单选 · 巩固

主动使用一个类时，类初始化通常先后按什么顺序进行？

A. 先初始化父类，再初始化子类
B. 先初始化子类，再初始化父类
C. 按字段名称字母序
D. 所有类在 JVM 启动时同时初始化

**参考答案：** A

**解析：** 类初始化会保证父类先于子类；接口相关细节则需按具体初始化规则分析。

**易错点：** 类加载、链接与初始化是不同阶段。

**知识小结：** 阅读静态初始化输出时，沿父子关系追踪。

#### J04-016 · 单选 · 巩固

`Class.forName("example.Widget")` 的常见效果是什么？

A. 只生成源码文件
B. 加载并初始化该类（默认使用当前调用方类加载器）
C. 实例化一个 Widget 对象
D. 自动调用 Widget 的所有实例方法

**参考答案：** B

**解析：** 常见单参数 Class.forName 会加载并初始化目标类。

**易错点：** 得到 Class 对象不等于创建实例。

**知识小结：** 需要仅加载而不初始化时，使用带 initialize 参数的重载。

#### J04-017 · 多选 · 综合

关于类加载器的双亲委派机制，哪些说法正确？

A. 优先让父加载器尝试加载类
B. 降低核心 API 被用户类重复定义替换的风险
C. 保证所有类只能由启动类加载器加载
D. 应用仍可通过自定义加载器扩展加载策略

**参考答案：** A、B、D

**解析：** 双亲委派有助于类身份与核心类安全，同时不排除自定义加载器。

**易错点：** 不同类加载器可以定义不同的同名类。

**知识小结：** 类身份由二进制名称和定义它的加载器共同决定。

#### J04-018 · 多选 · 综合

关于反射和 Class 对象，哪些描述正确？

A. 反射可以检查类型成员并在权限允许时调用方法
B. 同名类即便由不同类加载器定义，也必然是相同运行时类型
C. 反射 API 操作失败可能抛出受检或运行时异常
D. `obj.getClass()` 返回对象运行时类的 Class 对象

**参考答案：** A、C、D

**解析：** Class 提供运行时类型信息；反射能动态操作成员并受访问控制影响。

**易错点：** 定义加载器不同可能使同名二进制类成为不同类型。

**知识小结：** 使用反射时应处理成员不存在、访问受限和目标调用异常。

#### J04-019 · 代码输出 · 巩固

静态初始化的打印顺序是什么？

```java
class Base { static { System.out.print("B"); } }
class Child extends Base { static { System.out.print("C"); } }
Class<?> type = Child.class;
new Child();
```

**参考答案**

```text
BC
```

**解析：** 取 Child.class 字面量不会触发初始化；new Child 时先初始化 Base，再初始化 Child。

**易错点：** 获取类字面量与主动初始化不是同一操作。

**知识小结：** 区分类信息解析与类初始化触发点。

#### J04-020 · 代码输出 · 基础

通过父类引用查看的运行时类名是什么？

```java
class Parent {}
class Child extends Parent {}
Parent item = new Child();
System.out.println(item.getClass().getSimpleName());
```

**参考答案**

```text
Child
```

**解析：** getClass 返回对象运行时类型，而非变量声明类型。

**易错点：** 静态类型影响编译期成员检查。

**知识小结：** 用 getClass 观察对象的实际类型。

#### J04-021 · 代码输出 · 巩固

静态初始化块执行几次？

```java
class Cache { static int loads; static { loads++; } }
new Cache(); new Cache();
System.out.println(Cache.loads);
```

**参考答案**

```text
1
```

**解析：** 类初始化对同一 Class 对象通常只执行一次；后续对象共享已初始化的类状态。

**易错点：** 每个对象构造不会重新执行静态初始化。

**知识小结：** 类初始化和实例初始化是两个阶段。

#### J04-022 · 代码纠错 · 综合

为什么静态字段读取时出现初始化错误？

```java
class Config { static int PORT = Integer.parseInt(System.getenv("PORT")); }
```

**参考答案：** 检查环境变量是否设置为合法整数，并在静态初始化中处理或避免外部配置失败。

**解析：** 类主动使用会触发静态字段初始化；解析失败可抛 NumberFormatException，并使类初始化失败。

**易错点：** 类初始化失败会影响该 Class 后续主动使用。

**知识小结：** 避免把不可靠外部输入解析放进不可恢复的静态初始化路径。

#### J04-023 · 代码纠错 · 综合

反射代码为什么找不到构造器？

```java
var ctor = type.getConstructor(String.class);
Object value = ctor.newInstance("x");
```

**参考答案：** 确认类确有 public String 构造器；否则使用 `getDeclaredConstructor(String.class)` 并按访问规则处理。

**解析：** getConstructor 只查找 public 构造器，不包括非 public 声明。

**易错点：** 获取声明成员和执行访问还受模块及访问控制影响。

**知识小结：** 选择符合成员可见性范围的反射 API。

### JVM 内存

#### J04-024 · 单选 · 巩固

Java 垃圾回收器主要依据什么判断对象是否可回收？

A. 对象最后一次创建的时间
B. 对象的 hashCode 是否为 0
C. 从 GC Roots 出发是否仍有可达路径
D. 程序员是否调用过 System.gc

**参考答案：** C

**解析：** 主流追踪式 GC 根据对象从根集合是否可达判断存活。

**易错点：** System.gc 只是请求，不保证立刻或必然执行回收。

**知识小结：** 对象生命周期取决于引用图，而非手动析构调用。

#### J04-025 · 单选 · 巩固

仅通过 SoftReference 或 WeakReference 可达的对象，在垃圾回收时有何区别？

A. 两者都保证对象永不回收
B. 弱引用比强引用更强
C. 软引用对象必须放在栈上
D. GC 可因内存需求清除软引用；弱引用不阻止其对象在下一次相关 GC 中被回收

**参考答案：** D

**解析：** 两种引用强度不同；软引用常用于内存敏感缓存，弱引用对象更容易被回收。

**易错点：** 具体回收时机仍由运行时决定。

**知识小结：** 缓存正确性不应依赖引用对象一定存活多久。

#### J04-026 · 多选 · 综合

关于 Java 对象回收，哪些说法正确？

A. try-with-resources 适合确定性关闭文件资源
B. 循环引用的对象只要整个环不可达，仍可被追踪式 GC 回收
C. 不可达表示对象符合回收条件，不代表立即回收
D. finalize 提供可靠、确定时机的资源释放

**参考答案：** A、B、C

**解析：** 追踪式 GC 能回收不可达循环；文件等资源应使用确定性的 close 结构。

**易错点：** finalize 已被弃用方向所取代且不可靠，不能用于资源生命周期保证。

**知识小结：** 用 AutoCloseable 和 try-with-resources 管理外部资源。

#### J04-027 · 多选 · 综合

哪些对象通常可能作为 GC Root 或根集合来源？

A. 任何已不可达对象的自身引用
B. 当前活动线程栈中可达的引用
C. 类静态字段引用
D. JNI 句柄引用

**参考答案：** B、C、D

**解析：** 活动栈、静态字段和 JNI 引用等可构成根集合来源。

**易错点：** 不可达对象内部的环不能凭自身恢复外部可达性。

**知识小结：** 沿根到对象的引用路径判断存活。

#### J04-028 · 代码输出 · 基础

这段代码运行后是否能访问到 value？

```java
Object value = new Object();
Object alias = value;
value = null;
System.out.println(alias != null);
```

**参考答案**

```text
true
```

**解析：** alias 仍指向对象，因此局部变量引用仍可访问该对象。

**易错点：** 清除一个变量不等于对象无引用。

**知识小结：** 检查是否有其他别名保持引用。

#### J04-029 · 单选 · 巩固

下面的弱引用代码打印 true 还是 false，哪种判断准确？

```java
var ref = new java.lang.ref.WeakReference<>(new Object());
System.out.println(ref.get() == null);
```

A. 两者都可能；没有保证 GC 已在读取前清除弱引用
B. 一定打印 false
C. 代码必然无法编译
D. 一定打印 true

**参考答案：** A

**解析：** 新对象没有其他强引用，但 GC 是否在读取前运行没有保证，因此结果不确定。

**易错点：** 不要把弱引用清除时机当成确定的输出。

**知识小结：** 弱引用对象的存活时间不能用于确定性业务逻辑。

#### J04-030 · 单选 · 巩固

执行 `System.gc()` 后，能否断定某个不可达对象已经被回收？

A. 能；只要引用变量被赋值为 null 就立即回收
B. 不能；调用仅请求 JVM 尝试回收，不保证特定对象的回收时机
C. 不能；因为 Java 完全不支持垃圾回收
D. 能；方法返回前所有不可达对象必须回收

**参考答案：** B

**解析：** System.gc() 不保证特定对象在调用返回前被回收。

**易错点：** System.gc 不是同步销毁 API。

**知识小结：** 正确程序不依赖手动触发 GC 的时间。

#### J04-031 · 代码纠错 · 综合

为什么这段缓存不能保证对象在需要时还存在？

```java
var cache = new java.util.WeakHashMap<Object, String>();
Object key = new Object();
cache.put(key, "value");
key = null;
```

**参考答案：** 若缓存值必须保留映射，应采用强引用键或其他明确生命周期策略；不要依赖 WeakHashMap 保留键。

**解析：** 弱键在没有其他强引用后可被 GC 清除，映射可能随之移除。

**易错点：** 弱引用缓存具有非确定性存活时间。

**知识小结：** 先定义缓存过期策略，再选择强引用或特殊引用。

#### J04-032 · 代码纠错 · 综合

为什么用 finalize 关闭文件可能造成资源泄漏？

```java
class ReaderOwner {
    java.io.Reader reader;
    ReaderOwner(java.io.Reader reader) { this.reader = reader; }
    @Override protected void finalize() throws java.io.IOException { reader.close(); }
}
```

**参考答案：** 让对象实现 AutoCloseable，并由调用方用 try-with-resources 显式关闭。

**解析：** finalize 调用时间不确定，也可能被禁用；即使执行，抛出的异常也不会为调用方提供可靠的关闭保证。

**易错点：** 垃圾回收与外部资源关闭是不同生命周期。

**知识小结：** 对文件、socket 等资源使用确定性释放机制。

### 并发基础

#### J04-033 · 单选 · 巩固

把字段声明为 volatile，能够保证什么？

A. 所有对象方法变成 synchronized
B. 线程永远不会被中断
C. 读写可见性与相关的内存顺序约束，但不保证复合操作原子
D. 所有线程自动互斥执行

**参考答案：** C

**解析：** volatile 建立特定的可见性和顺序保证，但 `count++` 仍由读、改、写组成。

**易错点：** 可见性与原子性是不同性质。

**知识小结：** 共享计数通常使用 synchronized 或原子类。

#### J04-034 · 单选 · 巩固

线程调用 `worker.join()` 正常返回后，主线程可以依赖什么？

A. 主线程一定已经被中断
B. 所有其他 JVM 线程也都终止了
C. worker 还未开始执行
D. worker 已经终止，且 worker 中的动作 happens-before join 返回后的动作

**参考答案：** D

**解析：** join 等待指定线程结束，并建立线程终止与成功 join 后动作之间的 happens-before。

**易错点：** join 只等待指定线程，不会停止进程中的其他线程。

**知识小结：** 用 join 建立清晰的线程完成和结果读取边界。

#### J04-035 · 多选 · 综合

关于共享计数器，哪些方案能保证并发递增不丢失更新？

A. 线程各自写入无同步的共享 `count++`
B. 只将 int 字段声明为 volatile
C. 使用 AtomicInteger.incrementAndGet
D. 对读改写全过程使用同一把 synchronized 锁

**参考答案：** C、D

**解析：** 同步临界区或原子类提供不可分割的递增操作。

**易错点：** volatile 不会把复合读改写合成为一个原子动作。

**知识小结：** 将原子性要求落实到完整操作，而非单个字段读写。

#### J04-036 · 多选 · 综合

哪些操作通常会建立 happens-before 关系？

A. 同一线程内程序顺序中的前序动作先于后续动作
B. 任意两个线程同时读取同一普通 int
C. 线程 A 调用 start 先于新线程中的动作
D. 线程对 volatile 字段的写先于后续对该字段的读

**参考答案：** A、C、D

**解析：** 程序顺序、volatile 同步关系和 start 关系均由内存模型定义。

**易错点：** 普通变量的并发读本身不会建立线程间顺序关系。

**知识小结：** 用明确同步边连接共享状态的写入与读取。

#### J04-037 · 代码输出 · 巩固

join 后会打印什么？

```java
class Box { int value; }
Box box = new Box();
Thread t = new Thread(() -> box.value = 7);
t.start();
t.join();
System.out.println(box.value);
```

**参考答案**

```text
7
```

**解析：** worker 在结束前写入 7，join 返回保证其先行动作对主线程可见。

**易错点：** 若没有 start/join 或其他同步关系，普通字段并发访问可能不可见。

**知识小结：** 通过线程完成协议安全发布结果。

#### J04-038 · 代码输出 · 巩固

原子计数最终是多少？

```java
var count = new java.util.concurrent.atomic.AtomicInteger(0);
count.incrementAndGet();
count.addAndGet(4);
System.out.println(count.get());
```

**参考答案**

```text
5
```

**解析：** 原子值从 0 加 1，再加 4，结果为 5。

**易错点：** 原子类只保护其定义的原子操作；复合业务逻辑仍需设计同步。

**知识小结：** 把共享计数封装到专门的原子类型中。

#### J04-039 · 代码输出 · 基础

执行后打印的布尔值是什么？

```java
var ready = new java.util.concurrent.atomic.AtomicBoolean(false);
ready.set(true);
System.out.println(ready.get());
```

**参考答案**

```text
true
```

**解析：** 同线程先写 true 再读取，因此得到 true；AtomicBoolean 还支持跨线程原子读写。

**易错点：** 这个顺序题本身不展示竞争条件。

**知识小结：** 原子类既提供原子性，也提供相应可见性语义。

#### J04-040 · 代码纠错 · 综合

为什么 volatile counter 仍可能少计？

```java
volatile int counter;
void increment() { counter++; }
```

**参考答案：** 改用 `AtomicInteger.incrementAndGet()`，或在整个 increment 方法/临界区加同步。

**解析：** counter++ 先读值、计算新值再写回，多个线程的步骤可能交错覆盖。

**易错点：** volatile 只保证字段访问语义，不保证复合更新原子。

**知识小结：** 把不可分割操作作为一个同步单位保护。

#### J04-041 · 代码纠错 · 综合

线程启动后为什么不能直接假设结果已写好？怎样等待它完成？

```java
int[] result = {0};
Thread worker = new Thread(() -> result[0] = 7);
worker.start();
System.out.println(result[0]);
```

**参考答案：** 在读取前调用 `worker.join()`，并处理 InterruptedException。

**解析：** start 只启动异步执行，不等待 run 完成；未同步的读取也不能依赖工作线程写入已可见。

**易错点：** 调度顺序不是固定的。

**知识小结：** 用 join、Future.get 等完成同步而非依赖休眠时间。

### 锁与线程池

#### J04-042 · 单选 · 巩固

使用显式 `ReentrantLock` 时，最重要的释放习惯是什么？

A. 在 finally 中 unlock，确保异常路径也释放
B. 不需要调用 unlock，GC 会释放
C. 每次 lock 后等待一秒
D. 只有线程成功时才 unlock

**参考答案：** A

**解析：** 锁获取后应在 finally 中释放，避免异常路径使其他线程永久等待。

**易错点：** ReentrantLock 不会因为对象被 GC 而自动替业务释放。

**知识小结：** 把 lock 与 try/finally 配对。

#### J04-043 · 单选 · 巩固

调用 ExecutorService.shutdown() 通常表示什么？

A. 只关闭当前调用线程
B. 不再接受新任务，并让已提交任务继续完成
C. 立刻中断所有正在执行的任务
D. 删除所有队列中的任务

**参考答案：** B

**解析：** shutdown 发出有序关闭请求：停止接收新任务，处理已提交任务。

**易错点：** shutdownNow 的语义更偏向尝试中断与返回未启动任务。

**知识小结：** 按所需关闭语义选择 shutdown 或 shutdownNow。

#### J04-044 · 多选 · 综合

关于线程池和 Future，哪些说法正确？

A. Future.get 通常会等待任务完成
B. submit 可返回 Future 供调用方取结果或状态
C. 线程池可避免为每个短任务反复创建线程
D. 调用 shutdown 后立即提交新任务仍必然成功

**参考答案：** A、B、C

**解析：** Future 表示异步结果；get 等待完成，线程池复用工作线程。

**易错点：** shutdown 后新任务会被拒绝。

**知识小结：** 管理好池的生命周期并处理拒绝、取消与异常。

#### J04-045 · 多选 · 综合

关于锁和并发容器，哪些说法正确？

A. 锁获取和释放可建立可见性关系
B. 在 finally 调用 unlock 可防止异常路径泄漏锁
C. ConcurrentHashMap 不允许 null 键和值
D. 把所有变量都声明 volatile 就等价于互斥锁

**参考答案：** A、B、C

**解析：** ConcurrentHashMap 禁止 null；锁提供互斥与内存可见性语义。

**易错点：** volatile 不提供互斥，也不能保护跨字段不变量。

**知识小结：** 根据共享状态操作选择锁、原子类或并发容器。

#### J04-046 · 代码输出 · 巩固

执行两次原子更新后打印什么？

```java
var count = new java.util.concurrent.atomic.AtomicInteger();
count.updateAndGet(n -> n + 2);
count.updateAndGet(n -> n * 3);
System.out.println(count.get());
```

**参考答案**

```text
6
```

**解析：** 默认初值为 0；先加 2 得 2，再乘 3 得 6。

**易错点：** updateAndGet 的变换按调用顺序作用于当前原子值。

**知识小结：** 复杂更新可用原子更新函数表达，但应保持函数无副作用。

#### J04-047 · 代码输出 · 巩固

两次更新后结果是多少？

```java
var map = new java.util.concurrent.ConcurrentHashMap<String, Integer>();
map.merge("hits", 1, Integer::sum);
map.merge("hits", 1, Integer::sum);
System.out.println(map.get("hits"));
```

**参考答案**

```text
2
```

**解析：** 两次 merge 对 hits 累加，最终为 2。

**易错点：** ConcurrentHashMap 不接受 null 键或 null 值。

**知识小结：** 对并发计数映射优先考虑原子 Map 操作。

#### J04-048 · 代码输出 · 巩固

tryLock 成功后会打印什么？

```java
var lock = new java.util.concurrent.locks.ReentrantLock();
boolean acquired = lock.tryLock();
try { System.out.println(acquired); } finally { if (acquired) lock.unlock(); }
```

**参考答案**

```text
true
```

**解析：** 当前线程持有新建且未被占用的锁，tryLock 返回 true。

**易错点：** 只有成功获得锁的线程才能 unlock。

**知识小结：** tryLock 分支需要处理获取失败时的替代路径。

#### J04-049 · 代码纠错 · 综合

为什么线程池关闭后这次提交会被拒绝？

```java
var pool = java.util.concurrent.Executors.newSingleThreadExecutor();
pool.shutdown();
pool.submit(() -> work());
```

**参考答案：** 把所有任务先提交，再调用 shutdown；或为新一批任务创建/获取仍开放的 Executor。

**解析：** shutdown 后 Executor 不再接受新任务。

**易错点：** shutdown 是生命周期状态转换，不是暂停。

**知识小结：** 先确定任务生产结束，再关闭执行器并等待完成。

#### J04-050 · 代码纠错 · 综合

为什么异常发生时其他线程仍拿不到这把锁？

```java
lock.lock();
work();
lock.unlock();
```

**参考答案：** 改用 `lock.lock(); try { work(); } finally { lock.unlock(); }`。

**解析：** work 抛异常时控制流跳过 unlock，锁被当前线程持有。

**易错点：** 显式 Lock 没有自动 try/finally 语法糖。

**知识小结：** 每次成功 lock 都确保存在 finally 解锁路径。

## 综合 · 30 题

### 数值计算

#### J05-001 · 代码输出 · 综合

long 变量最终会保存并输出什么值？

```java
long total = 2_000_000_000 + 2_000_000_000;
System.out.println(total);
```

**参考答案**

```text
-294967296
```

**解析：** 两个字面量都在 int 范围内，先以 int 完成加法并发生溢出，再把溢出结果转成 long。若要用 long 运算，应把至少一个操作数写成 long，例如 2_000_000_000L。

**易错点：** 左侧变量是 long，不会反向改变右侧表达式已经选定的运算类型。

**知识小结：** 在表达式操作数处提升类型，避免中间计算先溢出。

### IO

#### J05-002 · 代码纠错 · 综合

使用 Files.lines 读取文件时，这段代码缺少什么？如何保证资源释放？

```java
Files.lines(path)
    .filter(line -> !line.isBlank())
    .forEach(System.out::println);
```

**参考答案：** Files.lines 返回的 Stream 持有文件资源，需要关闭。将其放入 try-with-resources：try (Stream<String> lines = Files.lines(path)) { ... }。

**解析：** 终端操作完成只会消费 Stream，不保证关闭底层文件资源。try-with-resources 会在作用域结束时调用 close。

**易错点：** 并非所有 Stream 都持有资源，但 Files.lines 明确需要关闭。

**知识小结：** 对文件、网络等资源型 Stream 使用 try-with-resources。

### 算法思路

#### J05-003 · 单选 · 综合

为避免 low + high 在极大数组下发生整数溢出，哪种中点写法更稳妥？

A. int mid = (low + high) / 2;
B. int mid = low + (high - low) / 2;
C. int mid = high - low / 2;
D. int mid = low * high / 2;

**参考答案：** B

**解析：** 当 low 与 high 都很大时，相加可能超过 int 上限。low + (high - low) / 2 在 low 不大于 high 的常见区间不需要直接把两个大索引相加。

- A：可能在加法阶段溢出。
- B：正确：先取区间差的一半，再加回 low。
- C：运算优先级和公式都不代表中点。
- D：乘法更容易溢出，也不是中点公式。

**易错点：** 即便数组长度受限，通用算法也应避免不必要的中间溢出。

**知识小结：** 二分查找常用 low + (high - low) / 2 计算中点。

### 综合应用

#### J05-004 · 单选 · 巩固

金额以最小货币单位的整数表示，且已确认总额不超过 long 范围。金额乘数量再累计时，应优先用什么类型保存总额？

A. char，因为金额是非负整数
B. byte，因为单个订单通常较小
C. long，并在乘法前保证至少一个操作数按 long 运算
D. boolean，因为只需要判断是否有金额

**参考答案：** C

**解析：** 多个订单金额相加可能超过 int；若乘法先以 int 发生溢出，之后转 long 也无法恢复。

**易错点：** 扩大总额变量不一定改变右侧中间表达式的类型。

**知识小结：** 从乘法操作数开始使用 long，并检查金额单位与溢出边界。

#### J05-005 · 单选 · 巩固

按商品 SKU 累计订单行数量，哪种结构最直接？

A. 用数组下标直接当 SKU 字符串
B. Set<Long>，只保存所有行数
C. Stack<String>，把 SKU 当作调用栈
D. Map<String, Long>，SKU 作键、累计数量作值

**参考答案：** D

**解析：** Map 将业务键映射到累计值，适合计数与汇总。

**易错点：** 若使用 Integer 汇总，也要评估总量是否可能超过范围。

**知识小结：** 根据访问方式选用最合适的数据结构。

#### J05-006 · 多选 · 综合

实现可靠订单汇总时，哪些做法有帮助？

A. 为金额、数量和总额选择足够宽的数值类型
B. 用不可变订单记录表达已校验的订单行
C. 对每一行无条件吞掉解析异常并继续，不记录错误
D. 对重复 SKU 使用 merge 或明确的累加逻辑

**参考答案：** A、B、D

**解析：** 可靠汇总需要范围适当的类型、清楚的数据模型和重复键聚合策略。

**易错点：** 吞异常会让部分失败被误认为成功汇总。

**知识小结：** 输入校验与聚合逻辑都应保留可解释的失败信息。

#### J05-007 · 多选 · 综合

关于汇总管道，哪些检查可减少结果错误？

A. 检查重复键由覆盖、求和还是拒绝处理
B. 确认金额舍入规则与币种精度
C. 依赖 HashMap 的迭代顺序生成报表
D. 确认空输入时的返回值

**参考答案：** A、B、D

**解析：** 空输入、冲突键和货币精度都是汇总的业务规则。

**易错点：** HashMap 没有排序承诺。

**知识小结：** 把报表顺序作为显式排序步骤。

#### J05-008 · 代码输出 · 巩固

SKU A 汇总数量是多少？

```java
record Line(String sku, int quantity) {}
var lines = java.util.List.of(new Line("A", 2), new Line("B", 3), new Line("A", 4));
var totals = new java.util.HashMap<String, Integer>();
for (var line : lines) totals.merge(line.sku(), line.quantity(), Integer::sum);
System.out.println(totals.get("A"));
```

**参考答案**

```text
6
```

**解析：** SKU A 的数量由两行组成，merge 将 2 与 4 累加。

**易错点：** 相同 SKU 是同一个 Map 键，需要累计而不是覆盖。

**知识小结：** 将重复键策略编码进 merge 函数。

#### J05-009 · 代码输出 · 巩固

这份报表按 SKU 字母序输出什么？

```java
var totals = new java.util.TreeMap<String, Integer>();
totals.put("B", 5); totals.put("A", 6);
System.out.println(totals);
```

**参考答案**

```text
{A=6, B=5}
```

**解析：** TreeMap 按键自然字典序遍历，A 排在 B 前面。

**易错点：** 排序由 Map 类型决定，不取决于 put 顺序。

**知识小结：** 输出顺序需要稳定时选择有序结构或显式排序。

#### J05-010 · 代码输出 · 巩固

long total 的最终值是多少？

```java
long total = 0;
int price = 1_500_000_000;
int quantity = 2;
total += (long) price * quantity;
System.out.println(total);
```

**参考答案**

```text
3000000000
```

**解析：** 把 price 在乘法前转换为 long，因此乘法以 long 执行，结果为 3000000000。

**易错点：** 若写成 `(long) (price * quantity)`，int 乘法会先溢出。

**知识小结：** 溢出保护要放在计算发生之前。

#### J05-011 · 代码纠错 · 综合

为什么汇总金额会在转换成 long 后仍是负数？

```java
long total = 0;
int price = 1_500_000_000;
int quantity = 2;
total += price * quantity;
```

**参考答案：** 改为 `total += (long) price * quantity;`，使乘法本身以 long 执行。

**解析：** price * quantity 先以 int 计算并溢出，再扩大为 long。

**易错点：** 左侧 long 目标不会反向扩大右侧表达式。

**知识小结：** 在易溢出的中间计算开始前提升操作数类型。

#### J05-012 · 代码纠错 · 综合

为什么重复 SKU 没有累加？怎样保留之前的数量？

```java
totals.put(line.sku(), line.quantity());
```

**参考答案：** 使用 `totals.merge(line.sku(), line.quantity(), Integer::sum)`，或读取旧值后显式相加。

**解析：** put 会直接覆盖该键当前值。

**易错点：** Map 的键唯一，累加需要业务明确的合并函数。

**知识小结：** 先定义重复记录策略，再选择 put 或 merge。

### 算法思路

#### J05-013 · 单选 · 基础

对已排序数组做二分查找，典型时间复杂度是多少？

A. O(log n)
B. O(n²)
C. O(1) 对任意数组都成立
D. O(n log n) 每次查找

**参考答案：** A

**解析：** 每轮将候选范围缩小约一半，比较次数随 log₂ n 增长。

**易错点：** 二分查找依赖输入按相同比较规则有序。

**知识小结：** 先检查排序前提，再使用二分查找。

#### J05-014 · 单选 · 基础

对空数组执行下标遍历时，最安全的循环条件通常是什么？

A. `i <= values.length`
B. `i < values.length`
C. `i == values.length`
D. `i > 0`

**参考答案：** B

**解析：** 长度为 0 时，i 从 0 开始即不满足 i < length，因此循环体不会执行。

**易错点：** `<=` 会在非空数组末尾访问下标 length。

**知识小结：** 用左闭右开的区间表达遍历边界。

#### J05-015 · 多选 · 综合

设计二分查找时，哪些约定要保持一致？

A. 数组比较顺序与排序时采用的规则
B. 找到元素后随意把 high 设为数组长度
C. 区间端点是否包含
D. mid 计算及左右边界更新规则

**参考答案：** A、C、D

**解析：** 闭区间或左闭右开区间都可行，但边界更新必须与约定配套。

**易错点：** 不一致更新会造成漏检或死循环。

**知识小结：** 逐轮证明候选区间缩小且保留可能解。

#### J05-016 · 多选 · 综合

关于算法复杂度，哪些说法正确？

A. 每次把规模减半的循环通常是 O(log n)
B. 遍历 n 个元素一次通常是 O(n)
C. 两层各遍历 n 次的嵌套循环通常是 O(n²)
D. 常数因子会保留在大 O 表达式中

**参考答案：** A、B、C

**解析：** 大 O 描述渐进增长，忽略常数倍；循环次数可按规模关系估算。

**易错点：** 输入分布、最坏情况或均摊口径需按题目说明。

**知识小结：** 从输入规模变化与操作次数关系推导复杂度。

#### J05-017 · 代码输出 · 基础

下面算法返回的下标是多少？

```java
int[] values = {1, 3, 5, 7, 9};
int index = java.util.Arrays.binarySearch(values, 7);
System.out.println(index);
```

**参考答案**

```text
3
```

**解析：** 数组升序且 7 位于下标 3，binarySearch 返回该下标。

**易错点：** 元素不存在时返回值是负编码，不是普通的 -1。

**知识小结：** 理解具体搜索 API 的未命中返回契约。

#### J05-018 · 代码输出 · 基础

循环后 sum 是多少？

```java
int[] values = {2, 2, 3};
int sum = 0;
for (int value : values) sum += value;
System.out.println(sum);
```

**参考答案**

```text
7
```

**解析：** 对数组三个元素逐个累计，2 + 2 + 3 = 7。

**易错点：** 求和保留重复元素，不等同于 Set 去重后求和。

**知识小结：** 先确认题目要求的是逐项累计还是按键去重。

#### J05-019 · 代码输出 · 基础

该实现返回的最大值是多少？

```java
int[] values = {-4, -2, -9};
int best = values[0];
for (int value : values) if (value > best) best = value;
System.out.println(best);
```

**参考答案**

```text
-2
```

**解析：** best 从数组中的真实元素 -4 初始化，遍历后更新为 -2。

**易错点：** 最大值初始为 0 会错误处理全负数输入。

**知识小结：** 使用首元素作初值，或明确处理空集合。

#### J05-020 · 代码纠错 · 综合

为什么数组包含重复值时结果计数不正确？

```java
int distinct = 0;
for (int i = 0; i < values.length; i++) distinct++;
```

**参考答案：** 使用 Set 存放已见元素并返回其大小，或在排序后只统计与前一项不同的值。

**解析：** 现有循环统计的是元素个数，重复元素也各计一次。

**易错点：** 区分输入项计数与不同值计数。

**知识小结：** 先把需求定义成唯一元素数，再选择去重策略。

#### J05-021 · 代码纠错 · 综合

为什么对空数组读取 values[0] 会失败？

```java
int max = values[0];
```

**参考答案：** 先检查数组非空；为空时返回 OptionalInt.empty、抛出明确异常或采用业务定义的默认结果。

**解析：** 长度为 0 时不存在下标 0。

**易错点：** 最大值问题对空输入需要显式定义语义。

**知识小结：** 数组访问前验证边界条件。

### 综合应用

#### J05-022 · 单选 · 巩固

服务层捕获异常后，最不利于排错的做法是什么？

A. 添加上下文后保留 cause 再抛出
B. 把可恢复的输入错误转换为明确业务结果
C. 吞掉异常并返回看似成功的默认值，不记录原因
D. 在边界处记录一次失败并向调用方反馈

**参考答案：** C

**解析：** 静默吞异常会把失败伪装成正常结果，让调用方无法判断数据是否完整。

**易错点：** 异常处理要么恢复，要么转换并保留因果信息。

**知识小结：** 让失败状态与成功结果在接口上可区分。

#### J05-023 · 单选 · 巩固

当方法需要返回“有值或没有值”，且缺失是正常业务状态时，哪种结果表达更清晰？

A. 返回 null 且不写文档
B. 返回任意特殊负数作为所有类型的缺失值
C. 捕获所有异常后返回对象的 toString
D. Optional<T> 或显式结果类型

**参考答案：** D

**解析：** 显式结果类型让调用方处理缺失分支。

**易错点：** null 可用但需要稳定的契约与防护。

**知识小结：** 将正常缺失和异常失败区分开。

#### J05-024 · 多选 · 综合

生产级文件导入流程中，哪些做法有助于数据可靠？

A. 遇到格式错误就静默跳过且仍报告全部导入成功
B. 校验每条输入并报告行号
C. 资源用 try-with-resources 关闭
D. 显式指定字符集

**参考答案：** B、C、D

**解析：** 编码、资源管理和逐条校验能让输入过程可重现且可诊断。

**易错点：** 静默跳过会让结果与输入内容不一致。

**知识小结：** 定义失败时回滚、部分接受或报告错误的业务策略。

#### J05-025 · 多选 · 综合

关于并发服务的共享状态，哪些设计较稳妥？

A. 使用线程安全的并发容器或在临界区同步
B. 把读取、校验和更新不变量作为整体原子操作
C. 共享 ArrayList 的多线程 add 一定安全
D. 明确对象的所有权与可变状态边界

**参考答案：** A、B、D

**解析：** 安全共享需要线程安全容器、明确所有权，并保护跨字段不变量。

**易错点：** 单个容器的线程安全也不自动使多步业务事务原子。

**知识小结：** 根据业务不变量的范围设计同步边界。

#### J05-026 · 代码输出 · 基础

参数校验抛出异常后，捕获并打印的消息是什么？

```java
try {
    java.util.Objects.requireNonNull(null, "name");
} catch (NullPointerException ex) {
    System.out.println(ex.getMessage());
}
```

**参考答案**

```text
name
```

**解析：** requireNonNull 收到 null 时抛 NullPointerException，并将 name 作为消息。

**易错点：** 验证失败应在边界尽早显现。

**知识小结：** 给参数校验异常提供能定位字段的消息。

#### J05-027 · 代码输出 · 巩固

关闭前后打印顺序是什么？

```java
var log = new StringBuilder();
try (var resource = new AutoCloseable() { public void close() { log.append("C"); } }) { log.append("W"); }
System.out.println(log);
```

**参考答案**

```text
WC
```

**解析：** try 主体追加 W，离开 try 时 close 追加 C。

**易错点：** 资源关闭发生在控制流离开 try-with-resources 主体时。

**知识小结：** 把资源生命周期和主体操作放入同一结构。

#### J05-028 · 代码输出 · 巩固

程序输出什么？

```java
var result = java.util.Optional.ofNullable("")
    .filter(s -> !s.isBlank()).orElse("fallback");
System.out.println(result);
```

**参考答案**

```text
fallback
```

**解析：** Optional 有空字符串，但 filter 因其 blank 丢弃值，orElse 返回 fallback。

**易错点：** Optional.ofNullable 只检查 null，不会自动过滤空字符串。

**知识小结：** 把 null、空串和空白串策略分别写清楚。

#### J05-029 · 代码纠错 · 综合

为什么 catch 之后调用方仍以为导入成功？怎样表达失败？

```java
try { importFile(path); } catch (IOException ignored) { }
return ImportResult.success();
```

**参考答案：** 在异常时返回失败结果或带错误详情的结果；必要时保留异常 cause 并记录上下文。

**解析：** 异常被忽略后仍无条件返回 success，失败被伪装为成功。

**易错点：** 不要用空 catch 隐藏数据导入失败。

**知识小结：** 让 API 的结果状态真实反映操作结果。

#### J05-030 · 代码纠错 · 综合

为什么这个共享计数在多线程下可能少于任务总数？

```java
class Stats { int completed; void done() { completed++; } }
```

**参考答案：** 用 AtomicInteger.incrementAndGet，或把 done 方法同步并通过同步读取结果。

**解析：** 普通 ++ 是读改写复合操作，多个线程可能覆盖彼此结果。

**易错点：** 字段可见性与递增原子性需要分别满足。

**知识小结：** 把并发更新封装为原子操作。
