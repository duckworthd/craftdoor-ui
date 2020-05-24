import axios from "@/axios";
import { Member } from "@/interfaces/api";

const MemberHelper = {
  async create(t: Member): Promise<Member> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    return await axios.post(url, t);
  },
  async list(): Promise<Member[]> {
    const url = `${CONFIG.API_ENDPOINT}/members`;
    return await axios.get(url);
  },
  async update(t: Member) {
    const url = `${CONFIG.API_ENDPOINT}/members/${t.id}`;
    return await axios.put(url, t);
  },
  async delete(id: number): Promise<Member> {
    const url = `${CONFIG.API_ENDPOINT}/members/${id}`;
    return await axios.delete(url);
  }
};

export default MemberHelper;
