<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            [
                'iso' => 'VE',
                'name' => 'Venezuela',
                'long_name' => 'República Bolivariana de Venezuela',
                'nacionality' => 'Venezolano/a',
                'phone_prefix' => '+58',
            ],
            [
                'iso' => 'CO',
                'name' => 'Colombia',
                'long_name' => 'República de Colombia',
                'nacionality' => 'Colombiano/a',
                'phone_prefix' => '+57',
            ],
            [
                'iso' => 'BR',
                'name' => 'Brasil',
                'long_name' => 'República Federativa do Brasil',
                'nacionality' => 'Brasileño/a',
                'phone_prefix' => '+55',
            ],
            [
                'iso' => 'EC',
                'name' => 'Ecuador',
                'long_name' => 'República del Ecuador',
                'nacionality' => 'Ecuatoriano/a',
                'phone_prefix' => '+593',
            ],
            [
                'iso' => 'US',
                'name' => 'Estados Unidos',
                'long_name' => 'Estados Unidos de América',
                'nacionality' => 'Estadounidense',
                'phone_prefix' => '+1',
            ],
            [
                'iso' => 'ES',
                'name' => 'España',
                'long_name' => 'Reino de España',
                'nacionality' => 'Español/a',
                'phone_prefix' => '+34',
            ],
            [
                'iso' => 'MX',
                'name' => 'México',
                'long_name' => 'Estados Unidos Mexicanos',
                'nacionality' => 'Mexicano/a',
                'phone_prefix' => '+52',
            ],
            [
                'iso' => 'AR',
                'name' => 'Argentina',
                'long_name' => 'República Argentina',
                'nacionality' => 'Argentino/a',
                'phone_prefix' => '+54',
            ],
            // Agrega más países según sea necesario
        ];

        foreach ($countries as $country) {
            Country::create([
                'iso' => $country['iso'],
                'name' => $country['name'],
                'long_name' => $country['long_name'],
                'nacionality' => $country['nacionality'],
                'phone_prefix' => $country['phone_prefix'],
            ]);
        }
    }
}
