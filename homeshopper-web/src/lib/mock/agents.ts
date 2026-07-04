import { Agent } from "@/lib/types";

export const agents: Agent[] = [
  {
    name: "김도윤",
    role: "전담 매니저",
    phone: "010-1234-5678",
    photo: "/images/people/person-01.png",
  },
  {
    name: "박민준",
    role: "임장 중개보조원",
    phone: "010-2345-6789",
    photo: "/images/people/person-02.png",
  },
  {
    name: "이서윤",
    role: "전담 중개사",
    phone: "010-3456-7890",
    photo: "/images/people/person-03.png",
  },
];

export function getAgentByRole(role: Agent["role"]): Agent | undefined {
  return agents.find((agent) => agent.role === role);
}
