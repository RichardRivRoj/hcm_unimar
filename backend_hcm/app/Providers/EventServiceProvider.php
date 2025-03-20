<?php

namespace App\Providers;

use App\Models\EvaluationPeriod;
use App\Observers\EvaluationPeriodObserver;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        EvaluationPeriod::observe(EvaluationPeriodObserver::class);
    }
}
