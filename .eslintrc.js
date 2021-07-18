module.exports = {
  root: true,
  overrides: [
    {
      files: [ '*.ts', '*.js' ],
      parserOptions: {
        project: [
          'tsconfig.*?.json',
        ],
        createDefaultProgram: true,
      },
      extends: ['plugin:@angular-eslint/recommended'],
      plugins: ['simple-import-sort'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^\\u0000'],
              ['^@angular'],
              ['^@[^models|services|guards|components|pipes|directives|modules|store|helpers]*'],
              ['^rxjs'],
              ['^app/'],
              ['^@models'],
              ['^@services'],
              ['^@guards'],
              ['^@components'],
              ['^@pipes'],
              ['^@directives'],
              ['^@modules'],
              ['^@store'],
              ['^@helpers'],
              ['^'],
              ['^\\.'],
            ],
          },
        ],
        'simple-import-sort/exports': 'error',
        'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
        'object-curly-spacing': [
          2,
          'always',
          {
            objectsInObjects: false,
            arraysInObjects: false,
          },
        ],
        'object-curly-newline': [ 'error', { consistent: true } ],
        'comma-spacing': [ 'error', { before: false, after: true } ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'space-before-blocks': [
          'error',
          {
            functions: 'always',
            keywords: 'always',
            classes: 'always',
          },
        ],
        'generator-star-spacing': [ 'error', { before: true, after: false } ],
        indent: [ 'error', 2, { SwitchCase: 1 } ],
        semi: [ 'error', 'always' ],
        'space-before-function-paren': [
          'error',
          {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
          },
        ],
        'space-in-parens': [ 'error', 'never' ],
        'key-spacing': [
          'error',
          {
            beforeColon: false,
            afterColon: true,
          },
        ],
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/ban-ts-comment': [
          1,
          {
            'ts-ignore': false,
            'ts-nocheck': true,
            'ts-check': true,
          },
        ],
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/member-delimiter-style': [
          1,
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
      },
    },
  ],
};
