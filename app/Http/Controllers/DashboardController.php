<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyAnswerResource;
use App\Http\Resources\SurveyDashboardResource;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index (Request $request) {
        $user = $request->user();

        // Total number of surveys
        $totalSurveys = Survey::where('user_id', $user->id)->count();

        // Latest survey
        $latestSurvey = Survey::where('user_id', $user->id)->latest('created_at')->first();

        // Total number of answers
        $totalAnswers = SurveyAnswer::query()
            ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
            ->where('surveys.user_id', $user->id)
            ->count();

        // Latest 5 answer
        // The getModels method returns an array containing all the Eloquent models within the collection. It provides direct access to the underlying array of models, allowing you to work with them in a more array-like manner if needed.
        $latestAnswers = SurveyAnswer::query()
            ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
            ->where('surveys.user_id', $user->id)
            ->orderBy('end_date', 'DESC')
            ->limit(5)
            ->getModels('survey_answers.*');

        // $totalLatestSurveyAnswers = ;

        return [
            'totalSurveys' => $totalSurveys,
            'latestSurvey' => $latestSurvey ? new SurveyDashboardResource($latestSurvey) : null,
            'totalAnswers' => $totalAnswers,
            'latestAnswers' => SurveyAnswerResource::collection($latestAnswers)
        ];
    }
}
