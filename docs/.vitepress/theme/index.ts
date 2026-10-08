import { defineXiHanTheme } from "@xihanfun/vitepress-theme";

export default defineXiHanTheme({
  pageMarkdown: true,
  // 运营数据由本站发布，本站直接读同源文件
  promotions: "/data/promotions.json",
});
