import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style']
      }
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1
      }
    ]
  }
})
