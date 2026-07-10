<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warung extends Model
{
    protected $fillable = [
        'name', 'address', 'phone', 'hari_distribusi', 'is_active', 
        'payment_status', 'margin_category', 'mg_normal', 'mg_absolut'
    ];
}
