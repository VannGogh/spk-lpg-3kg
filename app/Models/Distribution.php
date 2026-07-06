<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    protected $fillable = ['date', 'total_stock', 'alpha_capping', 'status'];

    public function details()
    {
        return $this->hasMany(DistributionDetail::class);
    }
}
