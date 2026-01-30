import { AppLayout } from "@/components/AppLayout";
import { Github, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Github className="w-20 h-20 mx-auto mb-8 text-white" />
        <h1 className="text-4xl font-bold mb-6">About GitClass</h1>
        <p className="text-xl text-[#7d8590] mb-12 leading-relaxed">
          GitClass 是一款专门为教学场景设计的作业提交与管理平台。
          我们深信 Git 的协作模式是处理作业提交、批阅和反馈的最佳方案。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
          <div className="p-6 border border-[#30363d] rounded-xl bg-[#161b22]">
            <h3 className="text-xl font-semibold mb-3 text-[#58a6ff]">致敬 GitHub</h3>
            <p className="text-[#7d8590]">
              本项目在 UI 交互和工作流逻辑上深度致敬了 <strong>GitHub</strong>。
              感谢 GitHub 为开发者社区提供的卓越工具和设计灵感。
            </p>
          </div>
          <div className="p-6 border border-[#30363d] rounded-xl bg-[#161b22]">
            <h3 className="text-xl font-semibold mb-3 text-[#58a6ff]">教学创新</h3>
            <p className="text-[#7d8590]">
              通过 Pull Request 进行作业批阅，让老师的反馈更加精准（支持行内评论）；
              通过 Issue 处理申诉，让师生沟通更加透明。
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#30363d]">
          <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            感谢名单
          </h2>
          <ul className="text-[#7d8590] space-y-2">
            <li>
              <Link href="https://github.com" className="text-[#58a6ff] hover:underline font-bold">GitHub</Link> - 提供产品灵感与交互范式
            </li>
            <li>Next.js, Tailwind CSS & Shadcn UI - 技术架构支持</li>
            <li>所有参与教学创新的老师与学生</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
