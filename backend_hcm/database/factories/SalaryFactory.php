<?php

namespace Database\Factories;

use App\Models\Currency;
use App\Models\Level;
use App\Models\Salary;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salary>
 */
class SalaryFactory extends Factory
{
    protected $model = Salary::class;

    public function definition()
    {
        // Genera fechas válidas (valid_from y valid_to)
        $validFrom = $this->faker->dateTimeBetween('-1 year', 'now');
        $validTo = $this->faker->dateTimeBetween($validFrom, '+1 year');

        return [
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'amount_letters' => $this->faker->sentence(3), // Ej: "Trescientos Cincuenta"
            'valid_from' => $validFrom,
            'valid_to' => $validTo,
            'currency_id' => Currency::inRandomOrder()->first()->id ?? Currency::factory(),
            'level_id' => Level::inRandomOrder()->first()->id ?? Level::factory(),
            'status_id' => Status::inRandomOrder()->first()->id ?? Status::factory(),
        ];
    }
}
