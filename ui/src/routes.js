import Account from './pages/Account';
import Users from './pages/Users';
import PatientDetails from './pages/PatientDetails';
import PatientList from './pages/PatientList';
import PresentPregnancy from './pages/PresentPregnancy';
import PatientRegistration from './pages/PatientRegistration';
import ConfirmPregnancy from './pages/ConfirmPregnancy';
import PhysicalExam from './pages/PhysicalExam';
import AntenatalProfile from './pages/AntenatalProfile';
import MOH100 from './pages/MOH100';
import CommunityReferrals from './pages/CommunityReferrals';
import Observations from './pages/Observations';
import ViewMOH100 from './pages/ViewMOH100';
import Treatment from './pages/Treatment';
import Reports from './pages/Reports';
import BirthPlan from './pages/BirthPlan';
import PreviousPregnancy from './pages/PreviousPregnancy';
import TetanusDiptheria from './pages/TetanusDiptheria';
import IFAS from './pages/IFAS';
import MalariaProphylaxis from './pages/MalariaProphylaxis';
import MaternalSerology from './pages/MaternalSerology';
import Deworming from './pages/Deworming';
import Counselling from './pages/Counselling';
import PMTCTInterventions from './pages/PMTCTInterventions';
import MedicalAndSurgicalHistory from './pages/MedicalAndSurgicalHistory';
import Facilites from './pages/Facilities';
import MOH711 from './pages/MOH711';
import Index from './pages/Index';

// these are the paths and elements that are used in the routes
/*
  <Route path="/" element={<Index />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/:id" element={<PatientDetails />} />
                    <Route path="/settings" element={<PatientDetails />} />
                    <Route path="/present-pregnancy" element={<PresentPregnancy />} />
                    <Route path="/physical-exam" element={<PhysicalExam />} />
                    <Route path="/patient-registration" element={<PatientRegistration />} />
                    <Route path="/antenatal-profile" element={<AntenatalProfile />} />
                    <Route path="/confirm-pregnancy" element={<ConfirmPregnancy />} />
                    <Route path="/community-referrals" element={<CommunityReferrals />} />
                    <Route path="/counselling-treatment" element={<Treatment />} />
                    <Route path="/moh-100" element={<MOH100 />} />
                    <Route path="/moh-711" element={<MOH711 />} />
                    <Route path="/birth-plan" element={<BirthPlan />} />
                    <Route path="/moh-reports" element={<Reports />} />
                    <Route path="/observations" element={<Observations />} />
                    <Route path="/referral/:id" element={<ViewMOH100 />} />
                    <Route path="/tetanus-diptheria" element={<TetanusDiptheria />} />
                    <Route path="/ifas" element={<IFAS />} />
                    <Route path="/malaria-prophylaxis" element={<MalariaProphylaxis />} />
                    <Route path="/maternal-serology" element={<MaternalSerology />} />
                    <Route path="/deworming" element={<Deworming />} />
                    <Route path="/counselling" element={<Counselling />} />
                    <Route path="/pmtct-interventions" element={<PMTCTInterventions />} />
                    <Route path="/medical-surgical-history" element={<MedicalAndSurgicalHistory />} />
*/

const appRoutes = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/patients',
    element: <PatientList />,
  },
  {
    path: '/patients/:id',
    element: <PatientDetails />,
  },
  {
    path: '/settings',
    element: <PatientDetails />,
  },
  {
    path: '/present-pregnancy',
    element: <PresentPregnancy />,
  },
  {
    path: '/physical-exam',
    element: <PhysicalExam />,
  },
  {
    path: '/patient-registration',
    element: <PatientRegistration />,
  },
  {
    path: '/antenatal-profile',
    element: <AntenatalProfile />,
  },
  {
    path: '/confirm-pregnancy',
    element: <ConfirmPregnancy />,
  },
  {
    path: '/community-referrals',
    element: <CommunityReferrals />,
  },
  {
    path: '/counselling-treatment',
    element: <Treatment />,
  },
  {
    path: '/moh-100',
    element: <MOH100 />,
  },
  {
    path: '/moh-711',
    element: <MOH711 />,
  },
  {
    path: '/birth-plan',
    element: <BirthPlan />,
  },
  {
    path: '/moh-reports',
    element: <Reports />,
  },
  {
    path: '/observations',
    element: <Observations />,
  },
  {
    path: '/referral/:id',
    element: <ViewMOH100 />,
  },
  {
    path: '/tetanus-diptheria',
    element: <TetanusDiptheria />,
  },
  {
    path: '/ifas',
    element: <IFAS />,
  },
  {
    path: '/malaria-prophylaxis',
    element: <MalariaProphylaxis />,
  },
  {
    path: '/maternal-serology',
    element: <MaternalSerology />,
  },
  {
    path: '/deworming',
    element: <Deworming />,
  },
  {
    path: '/counselling',
    element: <Counselling />,
  },
  {
    path: '/pmtct-interventions',
    element: <PMTCTInterventions />,
  },
  {
    path: '/medical-surgical-history',
    element: <MedicalAndSurgicalHistory />,
  },
];

export default appRoutes;