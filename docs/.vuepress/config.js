import { defaultTheme } from 'vuepress'

module.exports = {
    base: '/openai-doc/',
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'OpenAI 中文文档',
            description: 'OpenAI 中文文档',
            selectLanguageName: '111',

        },
        '/en/': {
            lang: 'en-US',
            title: 'OpenAI docs',
            description: 'OpenAI docs',
            selectLanguageName: 'English',
        }
    },
}