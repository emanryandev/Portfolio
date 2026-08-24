<?php

namespace App\Policies;

use App\Models\ContactRequest;
use App\Models\User;

class ContactRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ContactRequest $contactRequest): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return false; // Admin cannot create, only public via another endpoint
    }

    public function update(User $user, ContactRequest $contactRequest): bool
    {
        return true;
    }

    public function delete(User $user, ContactRequest $contactRequest): bool
    {
        return true;
    }
}
