<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyPublicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// auth endpoints
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// public page endpoints
Route::get('/survey-by-slug/{survey:slug}', [SurveyPublicController::class, 'showPublic'])->name('survey.public');
Route::post('/survey/{survey}/answer', [SurveyPublicController::class, 'storeAnswer'])->name('survey.answer');

Route::middleware('auth:sanctum')->group(function() {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::resource('/survey', SurveyController::class);
    
});