import ListTeamSuccessful from "../../../components/RescueCoordinatorComponents/ListTeamSuccessful/ListTeamSuccessful";
import RescueReportDetail from "../../../components/RescueCoordinatorComponents/RescueReportDetail/RescueReportDetail";
import "./RescueReportPage.css";

export default function RescueReportPage() {
  return (
    <section className="rc-report-page">
      {/* LEFT */}
      <aside className="rc-report-page__left">
        <ListTeamSuccessful />
      </aside>

      {/* RIGHT */}
      <main className="rc-report-page__right">
        <RescueReportDetail />
      </main>
    </section>
  );
}
