<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyQuestion;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        // if data contain image file
        if(isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);

        // Enter questions data
        foreach($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();
        // if data contain image file
        if(isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // if there is an old image
            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }

        $survey->update($data);
        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $survey->delete();

         // if there is an old image
         if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }
        
        return response()->json(null, 204);
    }


    // image checking validation n creation
    private function saveImage($image) {
        // check if image is valid base64 string
        if(preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // check if file is an image
            if(!in_array($type, ['png', 'jpg', 'jpeg', 'gif'])) {
                throw new \Exception('Invalid image type.');
            }

            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if($image === false) {
                throw new \Exception('Base64 decode failed.');
            }

        } else {
            throw new \Exception('Did not match data URI with image data.');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if(!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    // Create question
    private function createQuestion($question) {
        
        if(is_array($question['data'])) {
            $question['data'] = json_encode($question['data']);
        }

        $validator = Validator::make($question, [
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Survey::TYPE_CHECKBOX,
                Survey::TYPE_RADIO,
                Survey::TYPE_SELECT,
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:surveys,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }
}
