import { RoleGuard } from "../RoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["student"]}>{children}</RoleGuard>;
}
