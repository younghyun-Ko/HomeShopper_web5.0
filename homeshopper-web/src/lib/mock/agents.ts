import { Agent } from "@/lib/types";

export const agents: Agent[] = [
  {
    name: "김도윤",
    role: "전담 매니저",
    phone: "010-1234-5678",
    photo: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "박서연",
    role: "임장 중개보조원",
    phone: "010-2345-6789",
    photo: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "박철수",
    role: "전담 중개사",
    phone: "010-3456-7890",
    photo: "https://i.pravatar.cc/150?img=15",
  },
];

export function getAgentByRole(role: Agent["role"]): Agent | undefined {
  return agents.find((agent) => agent.role === role);
}
