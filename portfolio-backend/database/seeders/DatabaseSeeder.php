<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\TeamMember;
use App\Models\Category;
use App\Models\Technology;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@portfolio.local',
            'password' => Hash::make('password'),
        ]);

        // 2. Team Members
        $felopater = TeamMember::create([
            'name' => 'Felopater Nabil',
            'slug' => 'felopater-nabil',
            'role' => 'Full-Stack Developer',
            'bio' => 'Senior Full-Stack Developer with deep expertise in Laravel, APIs, Database Architecture, and modern frontend ecosystems.',
            'order' => 1,
        ]);

        $eman = TeamMember::create([
            'name' => 'Eman Alaa',
            'slug' => 'eman-alaa',
            'role' => 'DevOps Engineer',
            'bio' => 'Infrastructure specialist focusing on Deployment, CI/CD, Server environments, and Monitoring.',
            'order' => 2,
        ]);

        $banseh = TeamMember::create([
            'name' => 'Banseh Salah',
            'slug' => 'banseh-salah',
            'role' => 'QA Engineer',
            'bio' => 'Software Quality Assurance Engineer specialized in Manual Testing, Test Cases, and Regression Testing.',
            'order' => 3,
        ]);

        // 3. Skills & Technologies
        $techNames = ['Laravel', 'React', 'MySQL', 'Docker', 'AWS', 'PHP', 'JavaScript', 'TailwindCSS'];
        foreach ($techNames as $tech) {
            Technology::create(['name' => $tech, 'slug' => Str::slug($tech)]);
            Skill::create(['name' => $tech]); // Keep simple parity for dummy data
        }

        // Attach skills
        $felopater->skills()->attach(Skill::whereIn('name', ['Laravel', 'PHP', 'React', 'MySQL', 'JavaScript', 'TailwindCSS'])->pluck('id'));
        $eman->skills()->attach(Skill::whereIn('name', ['Docker', 'AWS', 'MySQL'])->pluck('id'));
        $banseh->skills()->attach(Skill::whereIn('name', ['JavaScript'])->pluck('id'));

        // 4. Categories
        $catWeb = Category::create(['name' => 'Web Application', 'slug' => 'web-application']);
        $catApi = Category::create(['name' => 'API Development', 'slug' => 'api-development']);

        // 5. Projects
        $project1 = Project::create([
            'name' => 'E-Commerce Platform',
            'slug' => 'ecommerce-platform',
            'description' => 'A high-performance B2B e-commerce platform built from scratch to handle millions of products.',
            'category_id' => $catWeb->id,
            'status' => 'completed',
            'is_featured' => true,
            'published_at' => now()->subMonths(2),
            'live_url' => 'https://example.com',
            'order' => 1,
        ]);

        $project1->technologies()->attach(Technology::whereIn('name', ['Laravel', 'React', 'MySQL'])->pluck('id'));

        // Project Contributions
        $project1->teamContributions()->createMany([
            [
                'team_member_id' => $felopater->id,
                'role' => 'Full-Stack Developer',
                'contribution_description' => 'Designed the core architecture, REST APIs, and integrated the complex React frontend.',
            ],
            [
                'team_member_id' => $eman->id,
                'role' => 'DevOps Engineer',
                'contribution_description' => 'Setup the AWS infrastructure, Dockerized the application, and built the CI/CD pipeline.',
            ],
            [
                'team_member_id' => $banseh->id,
                'role' => 'QA Engineer',
                'contribution_description' => 'Executed rigorous end-to-end testing, catching critical state bugs before production.',
            ],
        ]);

        // 6. Services / Packages
        $service1 = Service::create([
            'name' => 'Complete Digital Solution',
            'slug' => 'complete-solution',
            'description' => 'End-to-end software development including design, backend, frontend, QA, and deployment.',
            'price_type' => 'custom',
            'is_featured' => true,
            'order' => 1,
        ]);

        $service1->features()->createMany([
            ['feature_name' => 'Custom Architecture Design', 'order' => 1],
            ['feature_name' => 'Full-Stack Development', 'order' => 2],
            ['feature_name' => 'QA & Testing', 'order' => 3],
            ['feature_name' => 'Production Deployment', 'order' => 4],
        ]);
        
        $service2 = Service::create([
            'name' => 'API Development',
            'slug' => 'api-development',
            'description' => 'Robust, secure, and scalable RESTful API development using Laravel.',
            'price_type' => 'starting_at',
            'price' => 2500,
            'is_featured' => false,
            'order' => 2,
        ]);
    }
}
