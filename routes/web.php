<?php

use App\Http\Controllers\HospitalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('hospitals', HospitalController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
