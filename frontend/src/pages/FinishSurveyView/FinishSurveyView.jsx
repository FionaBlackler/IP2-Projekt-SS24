import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import './finishSurveyView.scss';
import { useSelector } from 'react-redux';

const FinishSurveyView = () => {
    const { scores, totalScore } = useSelector((state) => state.surveyScoresSave);

    return (
        <div className="finish-survey-view-container">
            <Result
                status="success"
                title="Geschafft!"
                subTitle={`Vielen Dank für Ihre Zeit! Sie haben ${scores} von ${totalScore} Punkten erreicht.`}
                extra={[
                    <Button type="primary" key="homepage">
                        <Link to="/">Zur Startseite</Link>
                    </Button>,
                    <Button key="surveys">
                        <Link to="/">Weitere Umfrage</Link>
                    </Button>
                ]}
            />
        </div>
    );
};

export default FinishSurveyView;
