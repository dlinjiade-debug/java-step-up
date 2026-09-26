# GitHub Pages 部署

GitHub Pages 适合发布本项目这样的静态 PWA。部署后任何人都可以访问网站；GitHub Free 账户托管 Pages 时，仓库需要设为公开。即使使用支持私有仓库的付费方案，发布出来的网站仍然是公开的。发布前确认题目和源码可以公开。

本项目中的答题进度保存在访问者自己的浏览器本地存储，不会提交到 GitHub 或同步到其他设备。GitHub Pages 仅托管静态文件，不提供用户账户或进度服务器。

## 首次设置

1. 在 GitHub 创建或选定一个仓库，将本项目推送到 main、master 或 feat/java-step-up 分支。
2. 打开仓库的 Settings / Pages，在 Build and deployment / Source 中选择 GitHub Actions。
3. 推送代码后，Actions 工作流会运行。成功后可从 Settings / Pages / Visit site 打开站点。

项目站点的地址通常为 https://<GitHub 用户名>.github.io/<仓库名>/。build:pages 使用相对路径构建，能兼容这种仓库子路径部署。

## 大陆访问说明

GitHub Pages 可从公网访问，但 GitHub 没有承诺中国大陆各运营商网络的可达性或稳定性，因此需要在目标手机和常用网络上实测。若需要更稳定的大陆公网访问，可将同一份静态构建部署到中国大陆云主机或对象存储，并按服务商要求完成域名和 ICP 备案。
