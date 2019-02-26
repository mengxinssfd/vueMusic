// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',//为vue的话html文件script标签里不能有缩进
    'html'
  ],
  // add your custom rules here
  rules: {
    /*  // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'*/
    'arrow-parens': 0,//箭头函数用小括号括起来
    // allow async-await
    'generator-star-spacing': 0,//生成器函数*的前后空格
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'eol-last': 0,//文件以单一的换行符结束
    'space-before-function-paren': 0,//函数定义时括号前面要不要有空格
    "semi": [2, "always"],//2强制以分号结尾 0是关闭检查
    'no-unused-expressions': ["error",{ "allowShortCircuit": true, "allowTernary": true }],//允许短路求值
    "no-eq-null": 0,
  }
}
