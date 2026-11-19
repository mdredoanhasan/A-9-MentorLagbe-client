import { RoleGuard } from "../RoleGuard";


export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="mentor">{children}</RoleGuard>;
}