import Button from "../../atoms/button";
import FeedbackAnimation from "../../atoms/feedback_animation";
import FeedilyHeading from "../../atoms/feedily_heading";
const LandingPage = () => {
    return (
        <div className="flex h-screen w-[40vw] items-center flex-col justify-between">
            <FeedilyHeading/>
            <p className="text-[25px] font-light">Feedback in a Flick</p>
            <FeedbackAnimation/>
            <div className="w-[65%] h-[30%] flex justify-between items-center">
                <Button name={"SignIn"} href={"/sign-in"}/>
                <Button name={"SignUp"} href={"/sign-up"}/>
            </div>
        </div>
    );
}

export default LandingPage;
