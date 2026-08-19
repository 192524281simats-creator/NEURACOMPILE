export const SAMPLE_PROGRAMS: Record<string, Record<string, string>> = {
  c: {
    "Basic Variables": `#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    int c = a + b * 2;
    printf("Result: %d", c);
    return 0;
}`,
    "Factorial": `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(5);
    printf("5! = %d", result);
    return 0;
}`,
    "Array Sum": `#include <stdio.h>

int main() {
    int arr[5];
    int sum = 0;
    int i = 0;
    while (i < 5) {
        sum = sum + arr[i];
        i = i + 1;
    }
    printf("Sum = %d", sum);
    return 0;
}`,
    "Optimization Demo": `int main() {
    int x = 10 * 5;
    int y = x + 0;
    int z = y * 1;
    int w = z + z;
    return w;
}`,
  },
  cpp: {
    "Hello World": `#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = 10;
    int sum = a + b;
    cout << "Sum = " << sum << endl;
    return 0;
}`,
    "Class Example": `#include <iostream>
using namespace std;

class Student {
public:
    int rollNo;
    float marks;
    
    float getGrade() {
        float grade = marks / 10;
        return grade;
    }
};

int main() {
    Student s;
    s.rollNo = 101;
    s.marks = 85;
    return 0;
}`,
  },
  python: {
    "Basic Arithmetic": `def calculate():
    a = 10
    b = 20
    c = a + b * 2
    result = c - 5
    return result

x = calculate()
print(x)`,
    "Loop Example": `def sum_range(n):
    total = 0
    i = 0
    while i < n:
        total = total + i
        i = i + 1
    return total

result = sum_range(10)
print(result)`,
    "Function Demo": `def power(base, exp):
    result = 1
    count = 0
    while count < exp:
        result = result * base
        count = count + 1
    return result

x = power(2, 8)
print(x)`,
  },
  lex: {
    "Keywords & Identifiers": `%{
#include <stdio.h>
%}

%%

"int"|"float"|"char"|"if"|"else"|"while"|"return"  { printf("KEYWORD: %s\\n", yytext); }
[a-zA-Z_][a-zA-Z0-9_]*  { printf("IDENTIFIER: %s\\n", yytext); }
[0-9]+  { printf("NUMBER: %s\\n", yytext); }
"="|"+"|"-"|"*"|"/"  { printf("OPERATOR: %s\\n", yytext); }
";"|","|"("|")"  { printf("SYMBOL: %s\\n", yytext); }
[ \\t\\n]  { /* skip whitespace */ }
.  { printf("UNKNOWN: %s\\n", yytext); }

%%

int yywrap() { return 1; }`,
    "Number Validator": `%{
#include <stdio.h>
%}

%%

[0-9]+\\.[0-9]+  { printf("FLOAT: %s\\n", yytext); }
[0-9]+  { printf("INTEGER: %s\\n", yytext); }
0[xX][0-9a-fA-F]+  { printf("HEX: %s\\n", yytext); }
[+-]?[0-9]+[eE][+-]?[0-9]+  { printf("SCIENTIFIC: %s\\n", yytext); }
[ \\t\\n]  {}
.  { printf("ERROR: Invalid character %s\\n", yytext); }

%%
int yywrap() { return 1; }`,
    "Email Validator": `%{
#include <stdio.h>
int valid = 0;
%}

ALPHA   [a-zA-Z]
DIGIT   [0-9]
LOCAL   ({ALPHA}|{DIGIT}|[._-])+
DOMAIN  ({ALPHA}|{DIGIT}|[.-])+

%%

{LOCAL}@{DOMAIN}\\.{ALPHA}{2,4}  { printf("VALID EMAIL: %s\\n", yytext); valid++; }
[ \\t\\n]  {}
.+  { printf("INVALID: %s\\n", yytext); }

%%
int yywrap() { return 1; }`,
  },
};
