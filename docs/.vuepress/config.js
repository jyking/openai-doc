import { defaultTheme } from 'vuepress'

export default {
    base: '/openai-doc/',
    lang: 'zh-CN',
    locales: {
        '/en/': {
            lang: 'en-US',
            title: 'OpenAI Documentation',
            description: 'OpenAI Documentation',
            
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'OpenAI 中文文档',
            description: 'OpenAI 中文文档',
        },
    },
    theme: defaultTheme({
        locales: {
            '/en/': {
                selectLanguageName: 'English',
                selectLanguageText: 'Languages',
                contributorsText: 'Contributors',
                lastUpdatedText: 'Last Updated',
                navbar: [
                    { text: "introduction", link: "/en/introduction/" },
                ],
                sidebar: {
                    '/en/introduction/': [
                        {
                            text: 'GET STARTED',
                            children: [
                                { text: 'introduction', link: '/en/introduction/' },
                            ],
                        }
                    ],
                }
            },
            '/zh/': {
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                contributorsText: '贡献者',
                lastUpdatedText: '上次更新',
                navbar: [
                    { text: "介绍", link: "/zh/introduction/" },
                ],
                sidebar: {
                    '/zh/introduction/': [
                        {
                            text: '起步',
                            children: [
                                { text: '介绍', link: '/zh/introduction/' },
                            ],
                        }
                    ],
                }
            },
        },

    }),
}
