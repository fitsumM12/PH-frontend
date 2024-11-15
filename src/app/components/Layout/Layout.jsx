import { MainSuspense } from "app/components";
import useSettings from "app/hooks/useSettings";
import { Layouts } from "./index";

export default function Layout(props) {
  const { settings } = useSettings();
  const Layout = Layouts[settings.activeLayout];

  return (
    <MainSuspense>
      <Layout {...props} />
    </MainSuspense>
  );
}
