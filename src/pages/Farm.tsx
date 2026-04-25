import Beehive from "../components/Beehive";
import BugTree from "../components/BugTree";
import InsectThicket from "../components/InsectThicket";

export default function Farm() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Beehive />
      <br />
      < InsectThicket />
      <br />
      < BugTree/>
    </div>
  );
}
