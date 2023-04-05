import { hopeTheme } from "vuepress-theme-hope";

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
    theme: hopeTheme({
        iconAssets: "fontawesome",
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
                home: '/zh/start/introduction/',
                navbar: [
                    {
                        text: "文档",
                        icon: "home",
                        link: "/zh/start/introduction/",
                        activeMatch: "^/zh/(start|guides|plugins)/",
                    },
                    {
                        text: "API 参考",
                        icon: "cloud",
                        link: "/zh/api-reference/",
                        activeMatch: "^/zh/api-reference/",
                    },
                ],
                sidebar: {
                    '/zh/': [
                        {
                            text: '起步',
                            icon: 'flag',
                            collapsible: true,
                            activeMatch: "^/zh/start/",
                            children: [
                                { text: '介绍', link: '/zh/start/introduction/', icon: 'book'},
                                { text: '快速开始', link: '/zh/start/quickstart/', icon: 'rocket' },
                                { text: '库文件', link: '/zh/start/libraries/', icon: 'file' },
                                { text: '模型', link: '/zh/start/models/', icon: 'brain' },
                                { text: '教程', link: '/zh/start/tutorials/', icon: 'graduation-cap' },
                            ],
                        },
                        {
                            text: '向导',
                            icon: 'compass',
                            collapsible: true,
                            activeMatch: "^/zh/guides/",
                            children: [
                                { text: '文本填充', link: '/zh/guides/completion/',icon: 'keyboard' },
                                { text: '聊天', link: '/zh/guides/chat/', icon: 'comments' },
                                { text: '图片', link: '/zh/guides/images/', icon: 'image' },
                                { text: '微调', link: '/zh/guides/fine-tuning/', icon: 'cogs' },
                                { text: '嵌入', link: '/zh/guides/embeddings/', icon: 'code' },
                                { text: '语音转文本', link: '/zh/guides/speech-to-text/', icon: 'microphone' },
                                { text: '适度', link: '/zh/guides/moderation/', icon: 'shield-alt' },
                                { text: '速度限制', link: '/zh/guides/rate-limits/', icon: 'clock' },
                                { text: '错误代码', link: '/zh/guides/error-codes/', icon: 'exclamation-triangle' },
                                { text: '最佳实践', link: '/zh/guides/safety-best-practices/', icon: 'shield-alt'},
                                { text: '生产最佳实践', link: '/zh/guides/production-best-practices/', icon: 'shield-alt' },
                            ],
                        },
                        {
                            text: '聊天插件',
                            icon: 'comments',
                            collapsible: true,
                            activeMatch: "^/zh/plugins/",
                            children: [
                                { text: '介绍', link: '/zh/plugins/introduction/', icon: 'book' },
                                { text: '入门', link: '/zh/plugins/getting-started/', icon: 'rocket' },
                                { text: '验证', link: '/zh/plugins/authentication/', icon: 'key' },
                                { text: '例子', link: '/zh/plugins/examples/', icon: 'code' },
                                { text: '生产', link: '/zh/plugins/production/', icon: 'cogs' },
                            ],
                        },
                        {
                            text: 'API 参考',
                            icon: 'cloud',
                            collapsible: true,
                            activeMatch: "^/zh/api-reference/",
                            children: [
                                { text: '介绍', link: '/zh/api-reference/', icon: 'book' },
                            ],
                        },
                    ],
                }
            },
        },
    }),
}
