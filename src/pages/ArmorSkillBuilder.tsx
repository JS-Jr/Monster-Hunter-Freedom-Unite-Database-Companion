import ContentWrapperProps from "../components/ContentWrapper";
import { Link } from "react-router-dom";

export default function ArmorSkillBuilder() {
  return (
    <ContentWrapperProps>
      <table>
        <thead>
          <tr>
            <th>Type / Component</th>
            <th>Selection</th>
            <th>Defense</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Helmet</td>
            <td>
              <Link to="/select/helmet">
                <button>+ Choose a Helmet</button>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Plate</td>
            <td>
              <Link to="/select/plate">
                <button>+ Choose a Plate</button>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Gauntlets</td>
            <td>
              <Link to="/select/gauntlets">
                <button>+ Choose a Gauntlet</button>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Waist</td>
            <td>
              <Link to="/select/waist">
                <button>+ Choose a Waist</button>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Leggings</td>
            <td>
              <Link to="/select/leggings">
                <button>+ Choose Leggings</button>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Weapon</td>
            <td>
              <Link to="/select/weapon">
                <button>+ Choose a Weapon</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </ContentWrapperProps>
  );
}
