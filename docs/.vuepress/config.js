import { defaultTheme } from 'vuepress'

export default {
    base: '/openai-doc/',
    lang: 'zh-CN',
    title: 'OpenAI 中文文档',
    description: 'OpenAI 中文文档',
    locales: {
        '/en/': {
            lang: 'en-US',
        },
        '/zh/': {
            lang: 'zh-CN',
        },
    },
    theme: defaultTheme({
        locales: {
            '/en/': {
                selectLanguageName: 'English',
                selectLanguageText: 'Languages',
                title: 'OpenAI Documentation',
                description: 'OpenAI Documentation',
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
