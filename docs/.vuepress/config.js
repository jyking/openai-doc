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
                home: '/zh/start/introduction/',
                navbar: [
                    { text: "文档", link: "/zh/start/introduction/" },
                    { text: "API 参考", link: "/zh/api-reference/" },
                ],
                sidebar: {
                    '/zh/api-reference/': [
                        {
                            text: '起步',
                            children: [
                                { text: '介绍', link: '/zh/start/introduction/' },
                                { text: '快速开始', link: '/zh/start/quickstart/' },
                                { text: '库文件', link: '/zh/start/libraries/' },
                            ],
                        },
                    ],
                    '/zh/start/': [
                        {
                            text: '起步',
                            children: [
                                { text: '介绍', link: '/zh/start/introduction/' },
                                { text: '快速开始', link: '/zh/start/quickstart/' },
                                { text: '库文件', link: '/zh/start/libraries/' },
                                { text: '模型', link: '/zh/start/models/' },
                                { text: '教程', link: '/zh/start/tutorials/' },
                            ],
                        },
                        {
                            text: '向导',
                            children: [
                                { text: '文本填充', link: '/zh/guides/completion/' },
                                { text: '聊天', link: '/zh/guides/chat/' },
                                { text: '图片', link: '/zh/guides/images/' },
                                { text: '微调', link: '/zh/guides/fine-tuning/' },
                                { text: '嵌入', link: '/zh/guides/embeddings/' },
                                { text: '语音转文本', link: '/zh/guides/speech-to-text/' },
                                { text: '适度', link: '/zh/guides/moderation/' },
                                { text: '速度限制', link: '/zh/guides/rate-limits/' },
                                { text: '错误代码', link: '/zh/guides/error-codes/' },
                                { text: '最佳实践', link: '/zh/guides/safety-best-practices/' },
                                { text: '生产最佳实践', link: '/zh/guides/production-best-practices/' },
                            ],
                        },
                        {
                            text: '聊天插件',
                            children: [
                                { text: '介绍', link: '/zh/plugins/introduction/' },
                                { text: '入门', link: '/zh/plugins/getting-started/' },
                                { text: '验证', link: '/zh/plugins/authentication/' },
                                { text: '例子', link: '/zh/plugins/examples/' },
                                { text: '生产', link: '/zh/plugins/production/' },
                            ],
                        },
                    ],
                }
            },
        },

    }),
}
