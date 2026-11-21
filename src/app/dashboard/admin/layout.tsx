import { RoleGuard } from "../RoleGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}