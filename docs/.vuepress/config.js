import { defaultTheme } from 'vuepress'

module.exports = {
    base: '/openai-doc/',
    lang: 'zh-CN',
    title: 'OpenAI 中文文档',
    description: 'OpenAI 中文文档',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'OpenAI 中文文档',
            description: 'OpenAI 中文文档',
            selectLanguageName: '简体中文',
        }
    },
    themeConfig: {
        home: "/introduction",
        nav: [
            { text: "首页", link: "/" },
            { text: "指南", link: "/introduction/" },
        ],
        footer: {
            author: '作者',
            lastUpdated: '最后更新时间',
        },
        lastUpdated: true,
        lastUpdatedText: "上次更新",
    }
}