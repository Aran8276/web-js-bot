<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Admin;

class AdminFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Admin::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'admin_user_id' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'group_list' => '{}',
            'login_email' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'login_password' => $this->faker->regexify('[A-Za-z0-9]{255}'),
        ];
    }
}
